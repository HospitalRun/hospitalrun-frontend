import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import VisitTable from '../../../patients/visits/VisitTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Visit, { VisitStatus } from '../../../shared/model/Visit'

const visit: Visit = {
  id: 'id',
  startDateTime: new Date(2020, 6, 3).toISOString(),
  endDateTime: new Date(2020, 6, 5).toISOString(),
  type: 'standard type',
  status: VisitStatus.Arrived,
  reason: 'some reason',
  location: 'main building',
} as Visit
const patient = {
  id: 'patientId',
  diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
  visits: [visit],
} as Patient

const setup = (expectedPatient = patient) => {
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const history = createMemoryHistory()
  history.push(`/patients/${patient.id}/visits/${patient.visits[0].id}`)

  return {
    history,
    ...render(
      <Router history={history}>
        <VisitTable patientId={expectedPatient.id} />
      </Router>,
    ),
  }
}

describe('Visit Table', () => {
  it('should render a table', async () => {
    setup()

    await screen.findByRole('table')

    expect(
      screen.getByRole('columnheader', { name: /patient.visits.startDateTime/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /patient.visits.endDateTime/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.type/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.status/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.reason/i })).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /patient.visits.location/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /actions\.view/i,
      }),
    ).toBeInTheDocument()

    const formatter = (dt: string) => format(new Date(dt), 'yyyy-MM-dd hh:mm a')
    expect(screen.getByRole('cell', { name: formatter(visit.startDateTime) })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: formatter(visit.endDateTime) })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: visit.type })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: visit.status })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: visit.reason })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: visit.location })).toBeInTheDocument()
  })

  it('should navigate to the visit view when the view details button is clicked', async () => {
    const { history } = setup()

    const actionButton = await screen.findByRole('button', {
      name: /actions\.view/i,
    })

    userEvent.click(actionButton)

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/visits/${visit.id}`)
  })

  it('should display a warning if there are no visits', async () => {
    setup({ ...patient, visits: [] })
    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('alert-warning')
    expect(screen.getByText(/patient.visits.warning.noVisits/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.visits.warning.addVisitAbove/i)).toBeInTheDocument()
  })
})
