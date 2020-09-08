import { Modal } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import AddCareGoalModal from '../../../patients/care-goals/AddCareGoalModal'
import CareGoalForm from '../../../patients/care-goals/CareGoalForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('Add Care Goal Modal', () => {
  const patient = {
    givenName: 'given Name',
    fullName: 'full name',
    careGoals: [] as CareGoal[],
  } as Patient

  const onCloseSpy = jest.fn()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()
    const wrapper = mount(
      <Router history={history}>
        <AddCareGoalModal patient={patient} show onCloseButtonClick={onCloseSpy} />
      </Router>,
    )

    wrapper.update()
    return { wrapper }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a modal', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)
    const sucessButton = modal.prop('successButton')
    const closeButton = modal.prop('closeButton')

    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.careGoal.new')
    expect(sucessButton?.children).toEqual('patient.careGoal.new')
    expect(sucessButton?.icon).toEqual('add')
    expect(closeButton?.children).toEqual('actions.cancel')
  })

  it('should render a care goal form', () => {
    const { wrapper } = setup()

    const careGoalForm = wrapper.find(CareGoalForm)
    expect(careGoalForm).toHaveLength(1)
  })

  it('should save care goal when save button is clicked and close', async () => {
    const expectedCreatedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedCreatedDate)

    const expectedCareGoal = {
      id: '123',
      description: 'some description',
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      note: '',
      priority: 'medium',
      status: CareGoalStatus.Accepted,
      achievementStatus: CareGoalAchievementStatus.InProgress,
      createdOn: expectedCreatedDate,
    }

    const { wrapper } = setup()
    await act(async () => {
      const careGoalForm = wrapper.find(CareGoalForm)
      const onChange = careGoalForm.prop('onChange') as any
      await onChange(expectedCareGoal)
    })

    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const sucessButton = modal.prop('successButton')
      const onClick = sucessButton?.onClick as any
      await onClick()
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith({
      ...patient,
      careGoals: [expectedCareGoal],
    })

    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
})
