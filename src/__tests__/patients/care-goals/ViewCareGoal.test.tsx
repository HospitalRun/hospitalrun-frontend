import { render as rtlRender } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React, { ReactNode, ReactElement } from 'react'
import { Router, Route } from 'react-router-dom'

import ViewCareGoal from '../../../patients/care-goals/ViewCareGoal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

describe('View Care Goal', () => {
  const patient = {
    id: '123',
    givenName: 'given Name',
    fullName: 'full Name',
    careGoals: [{ id: '123', description: 'some description' }],
  } as Patient

  const render = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals/${patient.careGoals[0].id}`)

    const Wrapper = ({ children }: WrapperProps): ReactElement => (
      <Router history={history}>
        <Route path="/patients/:id/care-goals/:careGoalId">{children}</Route>
      </Router>
    )

    const results = rtlRender(<ViewCareGoal />, { wrapper: Wrapper })

    return results
  }

  it('should render the care goal form', () => {
    const { container } = render()
    expect(container.querySelectorAll('div').length).toBe(4)
  })
})
