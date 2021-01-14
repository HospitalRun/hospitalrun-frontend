import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import CareGoalTable from '../../../patients/care-goals/CareGoalTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('Care Goal Table', () => {
  const expectedDate = new Date().toISOString()
  const careGoal: CareGoal = {
    id: '123',
    description: 'some description',
    priority: 'medium',
    status: CareGoalStatus.Accepted,
    achievementStatus: CareGoalAchievementStatus.Improving,
    startDate: expectedDate,
    dueDate: expectedDate,
    createdOn: expectedDate,
    note: 'some note',
  }

  const patient = {
    givenName: 'given Name',
    fullName: 'full Name',
    careGoals: [careGoal],
  } as Patient

  const setup = async (expectedPatient = patient) => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals/${patient.careGoals[0].id}`)

    return {
      history,
      ...render(
        <Router history={history}>
          <CareGoalTable patientId={expectedPatient.id} />
        </Router>,
      ),
    }
  }

  it('should render a table', async () => {
    setup()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    const columns = screen.getAllByRole('columnheader')
    expect(columns[0]).toHaveTextContent(/patient.careGoal.description/i)
    expect(columns[1]).toHaveTextContent(/patient.careGoal.startDate/i)
    expect(columns[2]).toHaveTextContent(/patient.careGoal.dueDate/i)
    expect(columns[3]).toHaveTextContent(/patient.careGoal.status/i)
    expect(columns[4]).toHaveTextContent(/actions.label/i)
    expect(screen.getByRole('button', { name: /actions.view/i })).toBeInTheDocument()

    const dates = screen.getAllByText(format(new Date(expectedDate), 'yyyy-MM-dd'))
    expect(screen.getByText(careGoal.description)).toBeInTheDocument()
    // startDate and dueDate are both rendered with expectedDate
    expect(dates).toHaveLength(2)
    expect(screen.getByText(careGoal.status)).toBeInTheDocument()
  })

  it('should navigate to the care goal view when the view details button is clicked', async () => {
    const { history } = await setup()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: /actions.view/i }))
    expect(history.location.pathname).toEqual(`/patients/${patient.id}/care-goals/${careGoal.id}`)
  })

  it('should display a warning if there are no care goals', async () => {
    setup({ ...patient, careGoals: [] })
    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('alert-warning')
    expect(screen.getByText(/patient.careGoals.warning.noCareGoals/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.careGoals.warning.addCareGoalAbove/i)).toBeInTheDocument()
  })
})
