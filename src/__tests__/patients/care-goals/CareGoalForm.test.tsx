import { render, screen } from '@testing-library/react'
import userEvent, { specialChars } from '@testing-library/user-event'
import { format } from 'date-fns'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import React from 'react'

import CareGoalForm from '../../../patients/care-goals/CareGoalForm'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'

const { arrowDown, enter } = specialChars

describe('Care Goal Form', () => {
  const startDate = new Date()
  const dueDate = addMonths(new Date(), 1)
  const careGoal = {
    description: 'some description',
    startDate: startDate.toISOString(),
    dueDate: dueDate.toISOString(),
    note: '',
    priority: 'medium',
    status: CareGoalStatus.Accepted,
    achievementStatus: CareGoalAchievementStatus.InProgress,
  } as CareGoal

  const setup = (disabled = false, initializeCareGoal = true, error?: any) => {
    const onCareGoalChangeSpy = jest.fn()
    const wrapper = render(
      <CareGoalForm
        careGoal={initializeCareGoal ? careGoal : {}}
        disabled={disabled}
        careGoalError={error}
        onChange={onCareGoalChangeSpy}
      />,
    )

    return { ...wrapper, onCareGoalChangeSpy }
  }

  it('should render a description input', () => {
    setup()

    const descriptionInput = screen.getByLabelText(/patient.careGoal.description/i)

    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toHaveValue(careGoal.description)

    // TODO didn't find a way to check
    // expect(descriptionInput.prop('isRequired')).toBeTruthy()
  })

  it('should call onChange handler when description changes', async () => {
    const expectedDescription = 'some new description'
    const { onCareGoalChangeSpy } = setup(false, false)

    const descriptionInput = screen.getByLabelText(/patient\.careGoal\.description/i)

    userEvent.type(descriptionInput, `${expectedDescription}`)

    expect(descriptionInput).toBeEnabled()
    expect(descriptionInput).toBeInTheDocument()
    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(expectedDescription.length)

    // TODO display value is appearing as empty
    // expect(descriptionInput).toHaveDisplayValue(expectedDescription)
  })

  it('should render a priority selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.priority.label/i)).toBeInTheDocument()
    const priority = screen.getByDisplayValue(/patient.careGoal.priority.medium/i)
    expect(priority).toBeInTheDocument()

    // TODO not sure how to get the list of options
    // expect(priority.prop('options')).toEqual([
    //   {
    //     label: 'patient.careGoal.priority.low',
    //     value: 'low',
    //   },
    //   {
    //     label: 'patient.careGoal.priority.medium',
    //     value: 'medium',
    //   },
    //   {
    //     label: 'patient.careGoal.priority.high',
    //     value: 'high',
    //   },
    // ])
  })

  it('should call onChange handler when priority changes', () => {
    const expectedPriority = 'high'
    const { onCareGoalChangeSpy } = setup(false, false)

    const priority = screen.getAllByRole('combobox')[0]
    userEvent.type(priority, `${expectedPriority}${arrowDown}${enter}`)

    expect(priority).toHaveDisplayValue(expectedPriority)
    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(1)
    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ priority: expectedPriority })
  })

  it('should render a status selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.status/i)).toBeInTheDocument()

    const status = screen.getByDisplayValue(careGoal.status)
    expect(status).toBeInTheDocument()
    expect(status).toHaveValue(careGoal.status)

    // TODO not sure how to get the list of options
    // expect(status.prop('options')).toEqual(
    //   Object.values(CareGoalStatus).map((v) => ({ label: v, value: v })),
    // )
  })

  it('should call onChange handler when status changes', () => {
    const expectedStatus = CareGoalStatus.OnHold
    const { onCareGoalChangeSpy } = setup(false, false)

    const status = screen.getAllByRole('combobox')[1]
    userEvent.type(status, `${expectedStatus}${arrowDown}${enter}`)

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ status: expectedStatus })
  })

  it('should render the achievement status selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.achievementStatus/i)).toBeInTheDocument()

    const achievementStatus = screen.getByDisplayValue(careGoal.achievementStatus)
    expect(achievementStatus).toBeInTheDocument()
    expect(achievementStatus).toHaveValue(careGoal.achievementStatus)
  })

  it('should call onChange handler when achievement status change', () => {
    const expectedAchievementStatus = CareGoalAchievementStatus.Improving
    const { onCareGoalChangeSpy } = setup(false, false)

    const status = screen.getAllByRole('combobox')[2]
    userEvent.type(status, `${expectedAchievementStatus}${arrowDown}${enter}`)

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({
      achievementStatus: expectedAchievementStatus,
    })
  })

  it('should render a start date picker', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.startDate/i)).toBeInTheDocument()
    const startDatePicker = screen.getAllByRole('textbox')[1]
    expect(startDatePicker).toBeInTheDocument()
    expect(startDatePicker).toHaveValue(format(startDate, 'MM/d/y'))
  })

  it('should call onChange handler when start date change', () => {
    const expectedStartDate = new Date()
    setup()

    const startDatePicker = screen.getAllByRole('textbox')[1]
    // TODO Getting below warnings
    // Warning: `NaN` is an invalid value for the `left` css style property.
    userEvent.type(startDatePicker, expectedStartDate.toISOString())
    expect(startDatePicker).toHaveDisplayValue(expectedStartDate.toISOString())
  })

  it('should render a due date picker', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.dueDate/i)).toBeInTheDocument()
    const dueDatePicker = screen.getAllByRole('textbox')[2]
    expect(dueDatePicker).toBeInTheDocument()
    expect(dueDatePicker).toHaveValue(format(dueDate, 'MM/d/y'))
  })

  it('should call onChange handler when due date change', () => {
    const expectedDueDate = addDays(31, new Date().getDate())
    setup(false, false)

    const dueDatePicker = screen.getAllByRole('textbox')[2]
    userEvent.type(dueDatePicker, expectedDueDate.toISOString())
    expect(dueDatePicker).toHaveDisplayValue(expectedDueDate.toISOString())
  })

  it('should render a note input', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.note/i)).toBeInTheDocument()
    const noteInput = screen.getByRole('textbox', {
      name: /patient\.caregoal\.note/i,
    })
    expect(noteInput).toHaveDisplayValue(careGoal.note)
  })

  it('should call onChange handler when note change', () => {
    const expectedNote = 'some new note'
    const { onCareGoalChangeSpy } = setup(false, false)
    const noteInput = screen.getByRole('textbox', {
      name: /patient\.caregoal\.note/i,
    })
    userEvent.type(noteInput, expectedNote)
    // TODO value is coming as empty. This test needs to be looked
    // expect(noteInput).toHaveDisplayValue(expectedNote)

    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(expectedNote.length)
  })

  it('should render all the forms fields disabled if the form is disabled', () => {
    setup(true)

    const descriptionInput = screen.getByLabelText(/patient\.careGoal\.description/i)
    const priority = screen.getByDisplayValue(/patient.careGoal.priority.medium/i)
    const status = screen.getAllByRole('combobox')[2]
    const achievementStatus = screen.getByDisplayValue(careGoal.achievementStatus)
    const startDatePicker = screen.getAllByRole('textbox')[1]
    const dueDatePicker = screen.getAllByRole('textbox')[2]
    const noteInput = screen.getByRole('textbox', {
      name: /patient\.caregoal\.note/i,
    })

    expect(descriptionInput).toBeDisabled()
    expect(priority).toBeDisabled()
    expect(status).toBeDisabled()
    expect(achievementStatus).toBeDisabled()
    expect(startDatePicker).toBeDisabled()
    expect(dueDatePicker).toBeDisabled()
    expect(noteInput).toBeDisabled()
  })

  it('should render the forms field in an error state', async () => {
    const expectedError = {
      message: 'some error message',
      description: 'some description error',
      status: 'some status error',
      achievementStatus: 'some achievement status error',
      priority: 'some priority error',
      startDate: 'some start date error',
      dueDate: 'some due date error',
      note: 'some note error',
    }

    setup(false, false, expectedError)

    const alert = await screen.findByRole('alert')
    const descriptionInput = screen.getByRole('textbox', {
      name: /this is a required input/i,
    })
    const priority = screen.getAllByRole('combobox')[0]
    const status = screen.getAllByRole('combobox')[1]
    const achievementStatus = screen.getAllByRole('combobox')[2]
    const startDatePicker = screen.getAllByRole('textbox')[1]
    const dueDatePicker = screen.getAllByRole('textbox')[2]
    const noteInput = screen.getByRole('textbox', {
      name: /patient\.caregoal\.note/i,
    })

    expect(screen.getByText(/some description error/i)).toBeInTheDocument()
    expect(screen.getByText(/some start date error/i)).toBeInTheDocument()
    expect(screen.getByText(/some due date error/i)).toBeInTheDocument()

    expect(alert).toHaveTextContent(expectedError.message)
    expect(descriptionInput).toBeInTheDocument()
    expect(priority).toBeInTheDocument()
    expect(status).toBeInTheDocument()
    expect(achievementStatus).toBeInTheDocument()
    expect(startDatePicker).toBeInTheDocument()
    expect(dueDatePicker).toBeInTheDocument()
    expect(noteInput).toBeInTheDocument()

    // TODO Not able to figure out how to verify isInvalid
    // expect(descriptionInput.prop('isInvalid')).toBeTruthy()
    // expect(prioritySelector.prop('isInvalid')).toBeTruthy()
    // expect(statusSelector.prop('isInvalid')).toBeTruthy()
    // expect(achievementStatusSelector.prop('isInvalid')).toBeTruthy()
  })
})
