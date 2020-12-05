import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
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
const history = createMemoryHistory()

let user: any
let store: any

const setup = (patient = expectedPatient, permissions = [Permissions.AddDiagnosis]) => {
  user = { permissions }
  store = mockStore({ patient, user } as any)
  return render(
    <Router history={history}>
      <Provider store={store}>
        <Diagnoses patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Diagnoses', () => {
  describe('add diagnoses button', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
    })

    it('should render a add diagnoses button', () => {
      setup()

      expect(
        screen.getByRole('button', {
          name: /patient\.diagnoses\.new/i,
        }),
      ).toBeInTheDocument()
    })

    it('should not render a diagnoses button if the user does not have permissions', () => {
      setup(expectedPatient, [])
      expect(
        screen.queryByRole('button', {
          name: /patient\.diagnoses\.new/i,
        }),
      ).not.toBeInTheDocument()
    })

    it('should open the Add Diagnosis Modal', () => {
      setup()

      userEvent.click(
        screen.getByRole('button', {
          name: /patient\.diagnoses\.new/i,
        }),
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
