import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Medications from '../../../patients/medications/Medications'
import PatientRepository from '../../../shared/db/PatientRepository'
import Medication from '../../../shared/model/Medication'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedMedications = [
  {
    id: '1',
    medication: 'medication name',
    status: 'active',
  },
  {
    id: '2',
    medication: 'medication name2',
    status: 'active',
  },
] as Medication[]
const expectedPatient = ({
  id: '123',
  rev: '123',
  medications: expectedMedications,
} as unknown) as Patient

let store: any

const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.ViewMedications],
  route = '/patients/123/medications',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  return render(
    <Router history={history}>
      <Provider store={store}>
        <Medications patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Medications', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'getMedications').mockResolvedValue(expectedMedications)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  describe('patient medications list', () => {
    it('should render patient medications', async () => {
      setup()
      expect(await screen.findByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('cell', { name: expectedMedications[0].medication }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('cell', { name: expectedMedications[1].medication }),
      ).toBeInTheDocument()
    })
  })
})
