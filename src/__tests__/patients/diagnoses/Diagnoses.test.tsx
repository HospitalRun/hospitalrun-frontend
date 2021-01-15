/* eslint-disable no-console */

import * as components from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
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
    { id: '123', name: 'diagnosis1', diagnosisDate: new Date().toISOString() } as Diagnosis,
  ],
} as Patient

const mockStore = createMockStore<RootState, any>([thunk])

const setup = async (route: string, permissions: Permissions[]) => {
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const store = mockStore({ user: { permissions } } as any)
  const history = createMemoryHistory()
  history.push(route)

  let wrapper: any
  await act(async () => {
    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/diagnoses">
            <Diagnoses />
          </Route>
        </Router>
      </Provider>,
    )
  })
  wrapper.update()
  return wrapper as ReactWrapper
}

describe('Diagnoses', () => {
  describe('add diagnoses button', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      console.error = jest.fn()
    })
    it('should render a add diagnoses button', async () => {
      const wrapper = await setup('/patients/123/diagnoses', [Permissions.AddDiagnosis])

      const addDiagnosisButton = wrapper.find(components.Button).at(0)
      expect(addDiagnosisButton).toHaveLength(1)
      expect(addDiagnosisButton.text().trim()).toEqual('patient.diagnoses.new')
    })

    it('should not render a diagnoses button if the user does not have permissions', async () => {
      const wrapper = await setup('/patients/123/diagnoses', [])

      const addDiagnosisButton = wrapper.find(components.Button)
      expect(addDiagnosisButton).toHaveLength(1)
      expect(addDiagnosisButton.at(0).text().trim()).not.toEqual('patient.diagnoses.new')
    })

    it('should open the Add Diagnosis Modal', async () => {
      const wrapper = await setup('/patients/123/diagnoses', [Permissions.AddDiagnosis])

      act(() => {
        const onClick = wrapper.find(components.Button).at(0).prop('onClick') as any
        onClick()
      })
      wrapper.update()

      expect(wrapper.find(components.Modal).prop('show')).toBeTruthy()
    })
  })
})
