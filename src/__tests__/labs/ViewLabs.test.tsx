import { TextInput, Select, Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as labsSlice from '../../labs/labs-slice'
import ViewLabs from '../../labs/ViewLabs'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Labs', () => {
  describe('title', () => {
    let titleSpy: any
    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
        labs: { labs: [] },
      } as any)
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
      } as any)
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
      } as any)
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
      patient: 'patientId',
      status: 'requested',
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as Lab

    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
        labs: { labs: [expectedLab] },
      } as any)
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
      const table = wrapper.find(Table)
      const columns = table.prop('columns')
      const actions = table.prop('actions') as any
      expect(columns[0]).toEqual(expect.objectContaining({ label: 'labs.lab.code', key: 'code' }))
      expect(columns[1]).toEqual(expect.objectContaining({ label: 'labs.lab.type', key: 'type' }))
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'labs.lab.requestedOn', key: 'requestedOn' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({ label: 'labs.lab.status', key: 'status' }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual([expectedLab])
    })

    it('should navigate to the lab when the view button is clicked', () => {
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
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
        patient: 'patientId',
        status: 'requested',
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Lab

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
          labs: { labs: [expectedLab] },
        } as any)
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
        patient: 'patientId',
        status: 'requested',
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Lab

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewLabs, Permissions.RequestLab] },
          labs: { labs: [expectedLab] },
        } as any)
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
