import { Table, Alert } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import CareGoalTable from '../../../patients/care-goals/CareGoalTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('Care Goal Table', () => {
  const careGoal: CareGoal = {
    id: '123',
    description: 'some description',
    priority: 'medium',
    status: CareGoalStatus.Accepted,
    achievementStatus: CareGoalAchievementStatus.Improving,
    startDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    createdOn: new Date().toISOString(),
    note: 'some note',
  }

  const patient = {
    givenName: 'given Name',
    fullName: 'full Name',
    careGoals: [careGoal],
  } as Patient

  const setup = async (expectedPatient = patient) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-goals/${patient.careGoals[0].id}`)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <CareGoalTable patientId={expectedPatient.id} />
        </Router>,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a table', async () => {
    const { wrapper } = await setup()

    const table = wrapper.find(Table)
    const columns = table.prop('columns')

    expect(columns[0]).toEqual(
      expect.objectContaining({ label: 'patient.careGoal.description', key: 'description' }),
    )
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'patient.careGoal.startDate', key: 'startDate' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'patient.careGoal.dueDate', key: 'dueDate' }),
    )
    expect(columns[3]).toEqual(
      expect.objectContaining({ label: 'patient.careGoal.status', key: 'status' }),
    )

    const actions = table.prop('actions') as any
    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    expect(table.prop('data')).toEqual(patient.careGoals)
  })

  it('should navigate to the care goal view when the view details button is clicked', async () => {
    const { wrapper, history } = await setup()

    const tr = wrapper.find('tr').at(1)

    act(() => {
      const onClick = tr.find('button').prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/care-goals/${careGoal.id}`)
  })

  it('should display a warning if there are no care goals', async () => {
    const { wrapper } = await setup({ ...patient, careGoals: [] })

    expect(wrapper.exists(Alert)).toBeTruthy()
    const alert = wrapper.find(Alert)
    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.careGoals.warning.noCareGoals')
    expect(alert.prop('message')).toEqual('patient.careGoals.warning.addCareGoalAbove')
  })
})
