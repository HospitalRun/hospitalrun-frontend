import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Diagnoses from '../../../patients/diagnoses/Diagnoses'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '123',
  diagnoses: [
    { id: '123', name: 'Hayfever', diagnosisDate: new Date().toISOString() } as Diagnosis,
  ],
} as Patient

const mockStore = createMockStore<RootState, any>([thunk])

const setup = async (patient = expectedPatient, permissions = [Permissions.AddDiagnosis]) => {
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
  const store = mockStore({ user: { permissions } } as any)
  const history = createMemoryHistory()
  history.push(`/patients/${patient.id}/diagnoses`)

  return render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/patients/:id/diagnoses">
          <Diagnoses />
        </Route>
      </Router>
    </Provider>,
  )
}

describe('Diagnoses', () => {
  describe('add diagnoses button', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
    })

    it('should render an add diagnoses button', async () => {
      setup()

      expect(
        await screen.findByRole('button', {
          name: /patient.diagnoses.new/i,
        }),
      ).toBeInTheDocument()
    })

    it('should not render a diagnoses button if the user does not have permissions', () => {
      setup(expectedPatient, [])

      expect(
        screen.queryByRole('button', {
          name: /patient.diagnoses.new/i,
        }),
      ).not.toBeInTheDocument()
    })

    it('should open the Add Diagnosis Modal', async () => {
      setup()

      userEvent.click(
        await screen.findByRole('button', {
          name: /patient.diagnoses.new/i,
        }),
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
