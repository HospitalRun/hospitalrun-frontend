/* eslint-disable no-console */

import * as components from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
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
    { id: '123', name: 'diagnosis1', diagnosisDate: new Date().toISOString() } as Diagnosis,
  ],
} as Patient

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let user: any
let store: any

const setup = (patient = expectedPatient, permissions = [Permissions.AddDiagnosis]) => {
  user = { permissions }
  store = mockStore({ patient, user } as any)
  const wrapper = mount(
    <Router history={history}>
      <Provider store={store}>
        <Diagnoses patient={patient} />
      </Provider>
    </Router>,
  )

  return wrapper
}
describe('Diagnoses', () => {
  describe('add diagnoses button', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      console.error = jest.fn()
    })
    it('should render a add diagnoses button', () => {
      const wrapper = setup()

      const addDiagnosisButton = wrapper.find(components.Button)
      expect(addDiagnosisButton).toHaveLength(1)
      expect(addDiagnosisButton.text().trim()).toEqual('patient.diagnoses.new')
    })

    it('should not render a diagnoses button if the user does not have permissions', () => {
      const wrapper = setup(expectedPatient, [])

      const addDiagnosisButton = wrapper.find(components.Button)
      expect(addDiagnosisButton).toHaveLength(0)
    })

    it('should open the Add Diagnosis Modal', () => {
      const wrapper = setup()

      act(() => {
        const onClick = wrapper.find(components.Button).prop('onClick') as any
        onClick()
      })
      wrapper.update()

      expect(wrapper.find(components.Modal).prop('show')).toBeTruthy()
    })
  })
})
