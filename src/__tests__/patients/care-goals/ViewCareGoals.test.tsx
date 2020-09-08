import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import CareGoalTable from '../../../patients/care-goals/CareGoalTable'
import ViewCareGoals from '../../../patients/care-goals/ViewCareGoals'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('View Care Goals', () => {
  const patient = { id: '123', careGoals: [] as CareGoal[] } as Patient
  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/care-goals">
            <ViewCareGoals />
          </Route>
        </Router>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a care goals table with the patient id', async () => {
    const { wrapper } = await setup()

    expect(wrapper.exists(CareGoalTable)).toBeTruthy()
    const careGoalTable = wrapper.find(CareGoalTable)
    expect(careGoalTable.prop('patientId')).toEqual(patient.id)
  })
})
