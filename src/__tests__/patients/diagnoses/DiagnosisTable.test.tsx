import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import DiagnosisTable from '../../../patients/diagnoses/DiagnosisTable'
import ViewDiagnosis from '../../../patients/diagnoses/ViewDiagnosis'
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

const setup = async (patient = expectedPatient) => {
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
  const history = createMemoryHistory()
  history.push(`/patients/${patient.id}/diagnoses/${diagnosis.id}`)

  return {
    history,
    ...render(
      <Router history={history}>
        <DiagnosisTable patientId={patient.id} />
        <Switch>
          <Route exact path="/patients/:id/diagnoses/:diagnosisId">
            <ViewDiagnosis />
          </Route>
        </Switch>
      </Router>,
    ),
  }
}

describe('Diagnosis Table', () => {
  it('should render a table', async () => {
    setup()
    await screen.findByRole('table')

    const columnHeaders = screen.getAllByRole('columnheader')
    expect(columnHeaders[0]).toHaveTextContent(/patient.diagnoses.diagnosisName/i)
    expect(columnHeaders[1]).toHaveTextContent(/patient.diagnoses.diagnosisDate/i)
    expect(columnHeaders[2]).toHaveTextContent(/patient.diagnoses.onsetDate/i)
    expect(columnHeaders[3]).toHaveTextContent(/patient.diagnoses.abatementDate/i)
    expect(columnHeaders[4]).toHaveTextContent(/patient.diagnoses.status/i)
    expect(columnHeaders[5]).toHaveTextContent(/actions.label/i)

    expect(await screen.findByRole('button', { name: /actions.view/i })).toBeInTheDocument()
  })

  it('should navigate to the diagnosis view when the view details button is clicked', async () => {
    const { history } = await setup()
    await screen.findByRole('table')

    userEvent.click(await screen.findByRole('button', { name: /actions.view/i }))
    expect(history.location.pathname).toEqual(
      `/patients/${expectedPatient.id}/diagnoses/${diagnosis.id}`,
    )

    const form = await screen.findByRole('form')
    expect(
      within(form).getByPlaceholderText(/patient.diagnoses.diagnosisName/i),
    ).toBeInTheDocument()
  })

  it('should display a warning if there are no diagnoses', async () => {
    await setup({ ...expectedPatient, diagnoses: [] })

    expect(await screen.findByText(/patient.diagnoses.warning.noDiagnoses/i)).toBeInTheDocument()
    expect(await screen.findByText(/patient.diagnoses.addDiagnosisAbove/i)).toBeInTheDocument()
  })
})
