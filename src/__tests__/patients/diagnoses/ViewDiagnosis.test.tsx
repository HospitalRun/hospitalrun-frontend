import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import ViewDiagnosis from '../../../patients/diagnoses/ViewDiagnosis'
import Loading from '../../../shared/components/Loading'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('View Diagnosis', () => {
  const diagnosis = {
    id: '123',
    name: 'some name',
    diagnosisDate: new Date().toISOString(),
  } as Diagnosis

  const patient = {
    id: 'patientId',
    diagnoses: [diagnosis],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/diagnoses/${diagnosis.id}`)
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

  it('should render the loading spinner only while diagnosis data is being fetched', async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/diagnoses/${diagnosis.id}`)
    const wrapper = mount(
      <Router history={history}>
        <Route path="/patients/:id/diagnoses/:diagnosisId">
          <ViewDiagnosis />
        </Route>
      </Router>,
    )

    expect(wrapper.exists).toBeTruthy()
    expect(wrapper.find(Loading)).toHaveLength(1)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    wrapper.update()

    expect(wrapper.find(Loading)).toHaveLength(0)
  })

  it('should render the diagnosis name', async () => {
    const { wrapper } = await setup()

    expect(wrapper.find('h2').text()).toEqual(diagnosis.name)
  })

  it('should render a diagnosis form with the correct data', async () => {
    const { wrapper } = await setup()

    const diagnosisForm = wrapper.find(DiagnosisForm)
    expect(diagnosisForm).toHaveLength(1)
    expect(diagnosisForm.prop('diagnosis')).toEqual(diagnosis)
    expect(diagnosisForm.prop('patient')).toEqual(patient)
  })
})
