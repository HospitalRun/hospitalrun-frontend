import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import AddCareGoalModal from '../../../patients/care-goals/AddCareGoalModal'
import CareGoal from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('Add Care Goal Modal', () => {
  const patient = {
    givenName: 'given Name',
    fullName: 'full name',
    careGoals: [] as CareGoal[],
  } as Patient

  const setup = () => {
    const history = createMemoryHistory()

    return render(
      <Router history={history}>
        <AddCareGoalModal patient={patient} show onCloseButtonClick={jest.fn()} />
      </Router>,
    )
  }

  it('should render a modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByText('patient.careGoal.new')[0]).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /patient.careGoal.new/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actions.cancel/i })).toBeInTheDocument()
  })

  it('should render a care goal form', () => {
    setup()

    expect(screen.getByLabelText('care-goal-form')).toBeInTheDocument()
  })
})
