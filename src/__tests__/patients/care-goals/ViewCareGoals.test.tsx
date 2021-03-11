import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewCareGoals from '../../../patients/care-goals/ViewCareGoals'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('View Care Goals', () => {
  const careGoal = {
    id: 'abc',
    status: 'accepted',
    startDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
  } as CareGoal
  const patient = { id: '123', careGoals: [careGoal] as CareGoal[] } as Patient
  const setup = async () => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/care-goals">
          <ViewCareGoals />
        </Route>
      </Router>,
    )
  }

  it('should render a care goals table', async () => {
    setup()

    expect(await screen.findByRole('table')).toBeInTheDocument()
  })
})
