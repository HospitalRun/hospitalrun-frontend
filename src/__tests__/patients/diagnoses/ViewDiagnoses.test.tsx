import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewDiagnoses from '../../../patients/diagnoses/ViewDiagnoses'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

const diagnosis = {
  id: '456',
  name: 'diagnosis name',
  diagnosisDate: new Date(2020, 12, 2).toISOString(),
  onsetDate: new Date(2020, 12, 3).toISOString(),
  abatementDate: new Date(2020, 12, 4).toISOString(),
  status: DiagnosisStatus.Active,
  note: 'note',
  visit: 'visit',
} as Diagnosis

const expectedPatient = {
  id: '123',
  diagnoses: [diagnosis],
} as Patient

const setup = async () => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)

  const history = createMemoryHistory()
  history.push(`/patients/${expectedPatient.id}/diagnoses`)

  return render(
    <Router history={history}>
      <Route path="/patients/:id/diagnoses">
        <ViewDiagnoses />
      </Route>
    </Router>,
  )
}

describe('View Diagnoses', () => {
  it('should render a diagnoses table with the patient id', async () => {
    setup()
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })
})
