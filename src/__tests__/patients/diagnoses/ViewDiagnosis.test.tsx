import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewDiagnosis from '../../../patients/diagnoses/ViewDiagnosis'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

const diagnosis = {
  id: '123',
  name: 'some name',
  diagnosisDate: new Date().toISOString(),
} as Diagnosis

const expectedPatient = {
  id: 'patientId',
  diagnoses: [diagnosis],
} as Patient

const setup = () => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const history = createMemoryHistory()
  history.push(`/patients/${expectedPatient.id}/diagnoses/${diagnosis.id}`)

  return render(
    <Router history={history}>
      <Route path="/patients/:id/diagnoses/:diagnosisId">
        <ViewDiagnosis />
      </Route>
    </Router>,
  )
}

describe('View Diagnosis', () => {
  it('should render the loading spinner only while diagnosis data is being fetched', async () => {
    const { container } = setup()

    expect(container.querySelector(`[class^='css-']`)).toBeInTheDocument()
    await waitForElementToBeRemoved(container.querySelector('.css-0'))
    expect(container.querySelector(`[class^='css-']`)).not.toBeInTheDocument()
  })

  it('should render the diagnosis name', async () => {
    setup()

    expect(await screen.findByRole('heading', { name: diagnosis.name })).toBeInTheDocument()
  })

  it('should render a diagnosis form', async () => {
    setup()

    expect(await screen.findByRole('form')).toBeInTheDocument()
  })
})
