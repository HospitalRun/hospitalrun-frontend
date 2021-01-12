import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router, Route } from 'react-router-dom'

import ViewCareGoal from '../../../patients/care-goals/ViewCareGoal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Care Goal', () => {
  const patient = {
    id: '123',
    givenName: 'given Name',
    fullName: 'full Name',
    careGoals: [{ id: '123', description: 'some description' }],
  } as Patient

  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals/${patient.careGoals[0].id}`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/care-goals/:careGoalId">
          <ViewCareGoal />
        </Route>
      </Router>,
    )
  }

  it('should render the care goal form', async () => {
    setup()

    expect(await screen.findByLabelText('care-goal-form')).toBeInTheDocument()
  })
})
