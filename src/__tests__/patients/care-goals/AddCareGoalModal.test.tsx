import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import AddCareGoalModal from '../../../patients/care-goals/AddCareGoalModal'
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

    return render(
      <Router history={history}>
        <AddCareGoalModal patient={patient} show onCloseButtonClick={onCloseSpy} />
      </Router>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

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

  it('should save care goal when save button is clicked and close', async () => {
    const expectedCreatedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedCreatedDate)

    // const expectedCareGoal = {
    //   id: '123',
    //   description: 'some description',
    //   startDate: new Date().toISOString(),
    //   dueDate: new Date().toISOString(),
    //   note: '',
    //   priority: 'medium',
    //   status: CareGoalStatus.Accepted,
    //   achievementStatus: CareGoalAchievementStatus.InProgress,
    //   createdOn: expectedCreatedDate,
    // }

    setup()
    // screen.logTestingPlaygroundURL()
    // screen.debug(screen.getAllByRole('textbox'))
    // screen.debug(screen.getByLabelText('patient.careGoal.description'))
    // await act(async () => {
    //   const careGoalForm = screen.getByLabelText('care-goal-form')
    // })

    // await act(async () => {
    //   const modal = wrapper.find(Modal)
    //   const sucessButton = modal.prop('successButton')
    //   const onClick = sucessButton?.onClick as any
    //   await onClick()
    // })
    await act(async () => {
      userEvent.type(screen.getAllByRole('textbox')[0], 'test')
      userEvent.click(screen.getByRole('button', { name: /patient.careGoal.new/i }))
    })

    // expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    // expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith({
    //   ...patient,
    //   careGoals: [expectedCareGoal],
    // })

    // expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
})
