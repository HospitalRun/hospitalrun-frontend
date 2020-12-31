import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
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

  return render(
    <Router history={history}>
      <Provider store={store}>
        <MedicationsList patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('MedicationsList', () => {
  describe('Table', () => {
    it('should render a list of medications', async () => {
      setup()
      expect(await screen.findByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /medications.medication.medication/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /medications.medication.priority/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /medications.medication.intent/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /medications.medication.requestedOn/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /medications.medication.status/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /actions.label/i })).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /actions.view/i })[0]).toBeInTheDocument()
    })

    it('should navigate to medication view on medication click', async () => {
      setup()
      expect(await screen.findByRole('table')).toBeInTheDocument()
      userEvent.click(screen.getAllByRole('button', { name: /actions.view/i })[0])
      expect(history.location.pathname).toEqual('/medications/123456')
    })
  })

  describe('no patient medications', () => {
    it('should render a warning message if there are no medications', async () => {
      setup(expectedPatient, [])
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/patient.medications.warning.noMedications/i)).toBeInTheDocument()
      expect(screen.getByText(/patient.medications.noMedicationsMessage/i)).toBeInTheDocument()
    })
  })
})
