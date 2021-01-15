import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import DiagnosisTable from '../../../patients/diagnoses/DiagnosisTable'
import ViewDiagnoses from '../../../patients/diagnoses/ViewDiagnoses'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('View Diagnoses', () => {
  const patient = { id: '123', diagnoses: [] as Diagnosis[] } as Patient
  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/diagnoses`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/diagnoses">
            <ViewDiagnoses />
          </Route>
        </Router>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a diagnoses table with the patient id', async () => {
    const { wrapper } = await setup()

    expect(wrapper.exists(DiagnosisTable)).toBeTruthy()
    const diagnosisTable = wrapper.find(DiagnosisTable)
    expect(diagnosisTable.prop('patientId')).toEqual(patient.id)
  })
})
