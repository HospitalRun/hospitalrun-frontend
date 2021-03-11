import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../../patients/labs/Labs'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedLabs = [
  {
    id: '456',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
  },
  {
    id: '123',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
  },
] as Lab[]
const expectedPatient = ({
  id: '123',
  rev: '123',
  labs: expectedLabs,
} as unknown) as Patient

let store: any

const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.ViewLabs],
  route = '/patients/123/labs',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)
  return render(
    <Router history={history}>
      <Provider store={store}>
        <Labs patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Labs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(expectedLabs)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  describe('patient labs list', () => {
    it('should render patient labs', async () => {
      setup()
      expect(await screen.findByRole('table')).toBeInTheDocument()
    })
  })
})
