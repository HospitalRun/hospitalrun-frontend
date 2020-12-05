import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import ViewDiagnosis from '../../../patients/diagnoses/ViewDiagnosis'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Diagnosis', () => {
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/diagnoses/${patient.diagnoses![0].id}`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/diagnoses/:diagnosisId">
            <ViewDiagnosis />
          </Route>
        </Router>,
      )
    })
    wrapper.update()

    return { wrapper }
  }

  it('should render the diagnosis name', async () => {
    const { wrapper } = await setup()

    expect(wrapper.find('h2').text()).toEqual(patient.diagnoses![0].name)
  })

  it('should render a diagnosis form with the correct data', async () => {
    const { wrapper } = await setup()

    const diagnosisForm = wrapper.find(DiagnosisForm)
    expect(diagnosisForm).toHaveLength(1)
    expect(diagnosisForm.prop('diagnosis')).toEqual(patient.diagnoses![0])
    expect(diagnosisForm.prop('patient')).toEqual(patient)
  })
})
