import * as components from '@hospitalrun/components'
import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import MedicationsList from '../../../patients/medications/MedicationsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Medication from '../../../shared/model/Medication'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '1234',
} as Patient

const expectedMedications = [
  {
    id: '123456',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    priority: 'routine',
  },
  {
    id: '456789',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    priority: 'routine',
  },
] as Medication[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, medications = expectedMedications) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getMedications').mockResolvedValue(medications)
  store = mockStore({ patient, medications: { medications } } as any)

  let wrapper: any

  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <MedicationsList patient={patient} />
        </Provider>
      </Router>,
    )
  })

  wrapper.update()

  return { wrapper: wrapper as ReactWrapper }
}

describe('MedicationsList', () => {
  describe('Table', () => {
    it('should render a list of medications', async () => {
      const { wrapper } = await setup()

      const table = wrapper.find(Table)

      const columns = table.prop('columns')
      const actions = table.prop('actions') as any

      expect(table).toHaveLength(1)

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
        expect.objectContaining({
          label: 'medications.medication.status',
          key: 'status',
        }),
      )
      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual(expectedMedications)
    })

    it('should navigate to medication view on medication click', async () => {
      const { wrapper } = await setup()
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/medications/123456')
    })
  })

  describe('no patient medications', () => {
    it('should render a warning message if there are no medications', async () => {
      const { wrapper } = await setup(expectedPatient, [])
      const alert = wrapper.find(components.Alert)

      expect(alert).toHaveLength(1)
      expect(alert.prop('title')).toEqual('patient.medications.warning.noMedications')
      expect(alert.prop('message')).toEqual('patient.medications.noMedicationsMessage')
    })
  })
})
