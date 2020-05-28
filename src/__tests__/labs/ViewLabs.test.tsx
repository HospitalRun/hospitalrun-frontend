import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import ViewLabs from 'labs/ViewLabs'
import { mount, ReactWrapper } from 'enzyme'
import { TextInput, Select } from '@hospitalrun/components'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import Permissions from 'model/Permissions'
import { act } from '@testing-library/react'
import LabRepository from 'clients/db/LabRepository'
import * as labsSlice from 'labs/labs-slice'
import Lab from 'model/Lab'
import format from 'date-fns/format'
import * as ButtonBarProvider from 'page-header/ButtonBarProvider'
import * as titleUtil from '../../page-header/useTitle'

const mockStore = configureMockStore([thunk])

describe('View Labs', () => {
  describe('title', () => {
    let titleSpy: any
    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
        labs: { labs: [] },
      })
      titleSpy = jest.spyOn(titleUtil, 'default')
      jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewLabs />
            </Router>
          </Provider>,
        )
      })
    })

    it('should have the title', () => {
      expect(titleSpy).toHaveBeenCalledWith('labs.label')
    })
  })

  describe('button bar', () => {
    it('should display button to add new lab request', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
        labs: { labs: [] },
      })
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewLabs />
            </Router>
          </Provider>,
        )
      })

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('labs.requests.new')
    })

    it('should not display button to add new lab request if the user does not have permissions', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs] },
        labs: { labs: [] },
      })
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewLabs />
            </Router>
          </Provider>,
        )
      })

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('table', () => {
    let wrapper: ReactWrapper
    let history: any
    const expectedLab = {
      code: 'L-1234',
      id: '1234',
      type: 'lab type',
      patientId: 'patientId',
      status: 'requested',
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as Lab

    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
        labs: { labs: [expectedLab] },
      })
      history = createMemoryHistory()

      jest.spyOn(LabRepository, 'findAll').mockResolvedValue([expectedLab])
      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <ViewLabs />
            </Router>
          </Provider>,
        )
      })

      wrapper.update()
    })

    it('should render a table with data', () => {
      const table = wrapper.find('table')
      const tableHeader = table.find('thead')
      const tableBody = table.find('tbody')

      const tableColumnHeaders = tableHeader.find('th')
      const tableDataColumns = tableBody.find('td')

      expect(table).toBeDefined()
      expect(tableHeader).toBeDefined()
      expect(tableBody).toBeDefined()
      expect(tableColumnHeaders.at(0).text().trim()).toEqual('labs.lab.code')

      expect(tableColumnHeaders.at(1).text().trim()).toEqual('labs.lab.type')

      expect(tableColumnHeaders.at(2).text().trim()).toEqual('labs.lab.requestedOn')

      expect(tableColumnHeaders.at(3).text().trim()).toEqual('labs.lab.status')

      expect(tableDataColumns.at(0).text().trim()).toEqual(expectedLab.code)

      expect(tableDataColumns.at(1).text().trim()).toEqual(expectedLab.type)

      expect(tableDataColumns.at(2).text().trim()).toEqual(
        format(new Date(expectedLab.requestedOn), 'yyyy-MM-dd hh:mm a'),
      )

      expect(tableDataColumns.at(3).text().trim()).toEqual(expectedLab.status)
    })

    it('should navigate to the lab when the row is clicked', () => {
      const table = wrapper.find('table')
      const tableBody = table.find('tbody')
      const tableRow = tableBody.find('tr').at(0)

      act(() => {
        const onClick = tableRow.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
    })
  })

  describe('dropdown', () => {
    it('should search for labs when dropdown changes', () => {
      const searchLabsSpy = jest.spyOn(labsSlice, 'searchLabs')
      let wrapper: ReactWrapper
      let history: any
      const expectedLab = {
        id: '1234',
        type: 'lab type',
        patientId: 'patientId',
        status: 'requested',
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Lab

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
          labs: { labs: [expectedLab] },
        })
        history = createMemoryHistory()

        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <Router history={history}>
                <ViewLabs />
              </Router>
            </Provider>,
          )
        })

        searchLabsSpy.mockClear()

        act(() => {
          const onChange = wrapper.find(Select).prop('onChange') as any
          onChange({
            target: {
              value: 'requested',
            },
            preventDefault: jest.fn(),
          })
        })

        wrapper.update()
        expect(searchLabsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('search functionality', () => {
    beforeEach(() => jest.useFakeTimers())

    afterEach(() => jest.useRealTimers())

    it('should search for labs after the search text has not changed for 500 milliseconds', () => {
      const searchLabsSpy = jest.spyOn(labsSlice, 'searchLabs')
      let wrapper: ReactWrapper
      let history: any
      const expectedLab = {
        id: '1234',
        type: 'lab type',
        patientId: 'patientId',
        status: 'requested',
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Lab

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
          labs: { labs: [expectedLab] },
        })
        history = createMemoryHistory()

        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([expectedLab])
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <Router history={history}>
                <ViewLabs />
              </Router>
            </Provider>,
          )
        })

        searchLabsSpy.mockClear()
        const expectedSearchText = 'search text'

        act(() => {
          const onClick = wrapper.find(TextInput).prop('onChange') as any
          onClick({
            target: {
              value: expectedSearchText,
            },
            preventDefault: jest.fn(),
          })
        })

        act(() => {
          jest.advanceTimersByTime(500)
        })

        wrapper.update()

        expect(searchLabsSpy).toHaveBeenCalledTimes(1)
        expect(searchLabsSpy).toHaveBeenLastCalledWith(expectedSearchText)
      })
    })
  })
})
