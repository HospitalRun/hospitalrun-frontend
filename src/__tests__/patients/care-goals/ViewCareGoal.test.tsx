import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router, Route } from 'react-router-dom'

import CareGoalForm from '../../../patients/care-goals/CareGoalForm'
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

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals/${patient.careGoals[0].id}`)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/care-goals/:careGoalId">
            <ViewCareGoal />
          </Route>
        </Router>,
      )
    })

    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render the care goal form', async () => {
    const { wrapper } = await setup()
    const careGoalForm = wrapper.find(CareGoalForm)

    expect(careGoalForm).toHaveLength(1)
    expect(careGoalForm.prop('careGoal')).toEqual(patient.careGoals[0])
  })
})
