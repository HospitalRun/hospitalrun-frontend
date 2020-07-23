import { TextInput, Select, Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as medicationsSlice from '../../medications/medications-slice'
import ViewMedications from '../../medications/ViewMedications'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import MedicationRepository from '../../shared/db/MedicationRepository'
import Medication from '../../shared/model/Medication'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Medications', () => {
  describe('title', () => {
    let titleSpy: any
    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewMedications, Permissions.RequestMedication] },
        medications: { medications: [] },
      } as any)
      titleSpy = jest.spyOn(titleUtil, 'default')
      jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewMedications />
            </Router>
          </Provider>,
        )
      })
    })

    it('should have the title', () => {
      expect(titleSpy).toHaveBeenCalledWith('medications.label')
    })
  })

  describe('button bar', () => {
    it('should display button to add new medication request', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewMedications, Permissions.RequestMedication] },
        medications: { medications: [] },
      } as any)
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewMedications />
            </Router>
          </Provider>,
        )
      })

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('medications.requests.new')
    })

    it('should not display button to add new medication request if the user does not have permissions', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewMedications] },
        medications: { medications: [] },
      } as any)
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewMedications />
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
    const expectedMedication = ({
      id: '1234',
      medication: 'medication',
      patient: 'patientId',
      status: 'draft',
      intent: 'order',
      priority: 'routine',
      quantity: { value: 1, unit: 'unit' },
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as unknown) as Medication

    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewMedications, Permissions.RequestMedication] },
        medications: { medications: [expectedMedication] },
      } as any)
      history = createMemoryHistory()

      jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([expectedMedication])
      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <ViewMedications />
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
      expect(columns[0]).toEqual(
        expect.objectContaining({ label: 'medications.medication.medication', key: 'medication' }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'medications.medication.priority', key: 'priority' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'medications.medication.intent', key: 'intent' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({
          label: 'medications.medication.requestedOn',
          key: 'requestedOn',
        }),
      )
      expect(columns[4]).toEqual(
        expect.objectContaining({ label: 'medications.medication.status', key: 'status' }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual([expectedMedication])
    })

    it('should navigate to the medication when the view button is clicked', () => {
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })
      expect(history.location.pathname).toEqual(`/medications/${expectedMedication.id}`)
    })
  })

  describe('dropdown', () => {
    it('should search for medications when dropdown changes', () => {
      const searchMedicationsSpy = jest.spyOn(medicationsSlice, 'searchMedications')
      let wrapper: ReactWrapper
      let history: any
      const expectedMedication = ({
        id: '1234',
        medication: 'medication',
        patient: 'patientId',
        status: 'draft',
        intent: 'order',
        priority: 'routine',
        quantity: { value: 1, unit: 'unit' },
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as unknown) as Medication

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewMedications, Permissions.RequestMedication] },
          medications: { medications: [expectedMedication] },
        } as any)
        history = createMemoryHistory()

        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <Router history={history}>
                <ViewMedications />
              </Router>
            </Provider>,
          )
        })

        searchMedicationsSpy.mockClear()

        act(() => {
          const onChange = wrapper.find(Select).prop('onChange') as any
          onChange({
            target: {
              value: 'draft',
            },
            preventDefault: jest.fn(),
          })
        })

        wrapper.update()
        expect(searchMedicationsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('search functionality', () => {
    beforeEach(() => jest.useFakeTimers())

    afterEach(() => jest.useRealTimers())

    it('should search for medications after the search text has not changed for 500 milliseconds', () => {
      const searchMedicationsSpy = jest.spyOn(medicationsSlice, 'searchMedications')
      let wrapper: ReactWrapper
      let history: any
      const expectedMedication = ({
        id: '1234',
        medication: 'medication',
        patient: 'patientId',
        status: 'draft',
        intent: 'order',
        priority: 'routine',
        quantity: { value: 1, unit: 'unit' },
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as unknown) as Medication

      beforeEach(async () => {
        const store = mockStore({
          title: '',
          user: { permissions: [Permissions.ViewMedications, Permissions.RequestMedication] },
          medications: { medications: [expectedMedication] },
        } as any)
        history = createMemoryHistory()

        jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([expectedMedication])
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <Router history={history}>
                <ViewMedications />
              </Router>
            </Provider>,
          )
        })

        searchMedicationsSpy.mockClear()
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

        expect(searchMedicationsSpy).toHaveBeenCalledTimes(1)
        expect(searchMedicationsSpy).toHaveBeenLastCalledWith(expectedSearchText)
      })
    })
  })
})
