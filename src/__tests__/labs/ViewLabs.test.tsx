import { TextInput, Select, Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewLabs from '../../labs/ViewLabs'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Labs', () => {
  let history: any
  const setButtonToolBarSpy = jest.fn()
  jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

  const setup = async (permissions: Permissions[]) => {
    history = createMemoryHistory()

    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <ViewLabs />
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  describe.only('title', () => {
    const titleSpy = jest.spyOn(titleUtil, 'default')

    it('should have the title', async () => {
      const { wrapper } = await setup([Permissions.ViewLabs, Permissions.RequestLab])
      wrapper.update()
<<<<<<< HEAD
=======
=======
    return { wrapper: wrapper as ReactWrapper }
  }

  describe('title', () => {
    const titleSpy = jest.spyOn(titleUtil, 'default')

    it('should have the title', async () => {
      await setup([Permissions.ViewLabs, Permissions.RequestLab])
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux

      expect(titleSpy).toHaveBeenCalledWith('labs.label')
    })
  })

<<<<<<< HEAD
  describe.only('button bar', () => {
=======
<<<<<<< HEAD
  describe.only('button bar', () => {
=======
  describe('button bar', () => {
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
    afterEach(() => {
      setButtonToolBarSpy.mockReset()
    })

    it('should display button to add new lab request', async () => {
<<<<<<< HEAD
      const { wrapper } = await setup([Permissions.ViewLab, Permissions.RequestLab])
      wrapper.update()
=======
<<<<<<< HEAD
      const { wrapper } = await setup([Permissions.ViewLab, Permissions.RequestLab])
      wrapper.update()
=======
      await setup([Permissions.ViewLab, Permissions.RequestLab])
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('labs.requests.new')
    })

    it('should not display button to add new lab request if the user does not have permissions', async () => {
<<<<<<< HEAD
      const { wrapper } = await setup([Permissions.ViewLabs])
      wrapper.update()
=======
<<<<<<< HEAD
      const { wrapper } = await setup([Permissions.ViewLabs])
      wrapper.update()
=======
      await setup([Permissions.ViewLabs])
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

<<<<<<< HEAD
  describe.only('table', () => {
=======
<<<<<<< HEAD
  describe.only('table', () => {
=======
  describe('table', () => {
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
    const expectedLab = {
      code: 'L-1234',
      id: '1234',
      type: 'lab type',
      patient: 'patientId',
      status: 'requested',
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as Lab

    jest.spyOn(LabRepository, 'findAll').mockResolvedValue([expectedLab])

    it('should render a table with data', async () => {
      const { wrapper } = await setup([Permissions.ViewLabs, Permissions.RequestLab])

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

    it('should navigate to the lab when the view button is clicked', async () => {
      const { wrapper } = await setup([Permissions.ViewLabs, Permissions.RequestLab])
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })
      expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
    })
  })

<<<<<<< HEAD
  describe.only('dropdown', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    afterEach(() => {
      searchLabsSpy.mockReset()
=======
<<<<<<< HEAD
  describe.only('dropdown', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    afterEach(() => {
      searchLabsSpy.mockReset()
=======
  describe('dropdown', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      searchLabsSpy.mockClear()
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
    })

    it('should search for labs when dropdown changes', async () => {
      const expectedStatus = 'requested'
      const { wrapper } = await setup([Permissions.ViewLabs])

      await act(async () => {
        const onChange = wrapper.find(Select).prop('onChange') as any
        await onChange([expectedStatus])
      })

<<<<<<< HEAD
      wrapper.update()

=======
<<<<<<< HEAD
      wrapper.update()

=======
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
      expect(searchLabsSpy).toHaveBeenCalledTimes(1)
      expect(searchLabsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: expectedStatus }),
      )
    })
  })

<<<<<<< HEAD
  describe.only('search functionality', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
      searchLabsSpy.mockReset()
    })

    it('should search for labs after the search text has not changed for 500 milliseconds', async () => {
=======
<<<<<<< HEAD
  describe.only('search functionality', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
      searchLabsSpy.mockReset()
    })

    it('should search for labs after the search text has not changed for 500 milliseconds', async () => {
=======
  describe('search functionality', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      searchLabsSpy.mockClear()
    })

    it('should search for labs after the search text has not changed for 500 milliseconds', async () => {
      jest.useFakeTimers()
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
      const { wrapper } = await setup([Permissions.ViewLabs])

      const expectedSearchText = 'search text'

      act(() => {
        const onChange = wrapper.find(TextInput).prop('onChange') as any
        onChange({
          target: {
            value: expectedSearchText,
          },
          preventDefault: jest.fn(),
        })
      })

      act(() => {
        jest.advanceTimersByTime(500)
      })

<<<<<<< HEAD
      wrapper.update()

=======
<<<<<<< HEAD
      wrapper.update()

=======
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
      expect(searchLabsSpy).toHaveBeenCalledTimes(1)
      expect(searchLabsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ text: expectedSearchText }),
      )
    })
  })
})
