import { screen, render, waitFor, within } from '@testing-library/react'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewVisit from '../../../patients/visits/ViewVisit'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Visit, { VisitStatus } from '../../../shared/model/Visit'

describe('View Visit', () => {
  const visit: Visit = {
    id: '123',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    type: 'emergency',
    status: VisitStatus.Arrived,
    reason: 'routine visit',
    location: 'main',
  } as Visit
  const patient = {
    id: 'patientId',
    visits: [visit],
  } as Patient

  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/visits/${patient.visits[0].id}`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/visits/:visitId">
          <ViewVisit patientId={patient.id} />
        </Route>
      </Router>,
    )
  }

  it('should render the visit reason', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: patient.visits[0].reason })).toBeInTheDocument()
    })
  })

  it('should render a visit form with the correct data', async () => {
    setup()

    expect(await screen.findByLabelText('visit form')).toBeInTheDocument()

    const startDateTimePicker = within(screen.getByTestId('startDateTimeDateTimePicker')).getByRole(
      'textbox',
    )
    const endDateTimePicker = within(screen.getByTestId('endDateTimeDateTimePicker')).getByRole(
      'textbox',
    )
    const typeInput = screen.getByPlaceholderText(/patient.visits.type/i)
    const statusSelector = screen.getByPlaceholderText('-- Choose --')
    const reasonInput = screen.getAllByRole('textbox', { hidden: false })[3]
    const locationInput = screen.getByPlaceholderText(/patient.visits.location/i)

    expect(startDateTimePicker).toHaveDisplayValue(
      format(new Date(visit.startDateTime), 'MM/dd/yyyy h:mm aa'),
    )
    expect(startDateTimePicker).toBeDisabled()
    expect(endDateTimePicker).toHaveDisplayValue(
      format(new Date(visit.endDateTime), 'MM/dd/yyyy h:mm aa'),
    )
    expect(endDateTimePicker).toBeDisabled()
    expect(typeInput).toHaveDisplayValue(visit.type)
    expect(typeInput).toBeDisabled()
    expect(statusSelector).toHaveDisplayValue(visit.status)
    expect(statusSelector).toBeDisabled()
    expect(reasonInput).toHaveDisplayValue(visit.reason)
    expect(reasonInput).toBeDisabled()
    expect(locationInput).toHaveDisplayValue(visit.location)
    expect(locationInput).toBeDisabled()
  })
})
