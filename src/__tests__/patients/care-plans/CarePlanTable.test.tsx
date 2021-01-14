import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import CarePlanTable from '../../../patients/care-plans/CarePlanTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'

describe('Care Plan Table', () => {
  const carePlan: CarePlan = {
    id: '0001',
    title: 'chicken pox',
    description: 'super itchy spots',
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Option,
    startDate: new Date(2020, 6, 3).toISOString(),
    endDate: new Date(2020, 6, 5).toISOString(),
    diagnosisId: '0123',
    createdOn: new Date().toISOString(),
    note: 'Apply Camomile lotion to spots',
  }
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '0123', name: 'chicken pox', diagnosisDate: new Date().toISOString() }],
    carePlans: [carePlan],
  } as Patient

  const setup = async (expectedPatient = patient) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-plans/${patient.carePlans[0].id}`)

    return {
      history,
      ...render(
        <Router history={history}>
          <CarePlanTable patientId={expectedPatient.id} />
        </Router>,
      ),
    }
  }

  it('should render a table', async () => {
    setup()

    await screen.findByRole('table')

    const columns = screen.getAllByRole('columnheader')

    expect(columns[0]).toHaveTextContent(/patient\.carePlan\.title/i)
    expect(columns[1]).toHaveTextContent(/patient\.carePlan\.startDate/i)
    expect(columns[2]).toHaveTextContent(/patient\.carePlan\.endDate/i)
    expect(columns[3]).toHaveTextContent(/patient\.carePlan\.status/i)

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /actions\.view/i,
        }),
      ).toBeInTheDocument()
    })
  })

  it('should navigate to the care plan view when the view details button is clicked', async () => {
    const { history } = await setup()

    await screen.findByRole('table')

    const actionButton = await screen.findByRole('button', {
      name: /actions\.view/i,
    })

    userEvent.click(actionButton)

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/care-plans/${carePlan.id}`)
  })

  it('should display a warning if there are no care plans', async () => {
    await setup({ ...patient, carePlans: [] })

    await waitFor(() => {
      expect(screen.getByText(/patient\.carePlans\.warning\.noCarePlans/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/patient\.carePlans\.warning\.addCarePlanAbove/i)).toBeInTheDocument()
    })
  })
})
