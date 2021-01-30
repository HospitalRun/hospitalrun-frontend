import { render, screen, within } from '@testing-library/react'
import userEvent, { specialChars } from '@testing-library/user-event'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import React from 'react'

import CareGoalForm from '../../../patients/care-goals/CareGoalForm'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'

const { arrowDown, enter } = specialChars

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

  const TestComponent = () => {
    const [careGoal2, setCareGoal] = React.useState(initializeCareGoal ? careGoal : {})

    onCareGoalChangeSpy.mockImplementation(setCareGoal)

    return (
      <CareGoalForm
        careGoal={careGoal2}
        disabled={disabled}
        careGoalError={error}
        onChange={onCareGoalChangeSpy}
      />
    )
  }

  return { ...render(<TestComponent />), onCareGoalChangeSpy }
}

describe('Care Goal Form', () => {
  it('should render a description input', () => {
    setup()

    const descriptionInput = screen.getByLabelText(/patient.careGoal.description/i)

    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toHaveValue(careGoal.description)

    // TODO: not using built-in form accessibility features yet: required attribute
    // expect((descriptionInput as HTMLInputElement).required).toBeTruthy()
  })

  it('should call onChange handler when description changes', async () => {
    const expectedDescription = 'some new description'
    const { onCareGoalChangeSpy } = setup(false, false)

    const descriptionInput = screen.getByLabelText(/patient\.careGoal\.description/i)

    userEvent.type(descriptionInput, `${expectedDescription}`)

    expect(descriptionInput).toBeEnabled()
    expect(descriptionInput).toBeInTheDocument()
    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(expectedDescription.length)
    expect(descriptionInput).toHaveDisplayValue(expectedDescription)
  })

  it('should render a priority selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.priority.label/i)).toBeInTheDocument()
    const priority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')
    expect(priority).toBeInTheDocument()

    userEvent.click(priority) // display popup with the options
    expect(screen.getByText(/patient.careGoal.priority.low/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.careGoal.priority.medium/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.careGoal.priority.high/i)).toBeInTheDocument()

    userEvent.click(screen.getByText(/patient.careGoal.priority.low/i))
    expect(priority).toHaveValue('patient.careGoal.priority.low')
    expect(screen.queryByText(/patient.careGoal.priority.medium/i)).not.toBeInTheDocument()
  })

  it('should call onChange handler when priority changes', () => {
    const expectedPriority = 'high'
    const { onCareGoalChangeSpy } = setup(false, false)

    const priority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')
    userEvent.type(priority, `${expectedPriority}${arrowDown}${enter}`)

    expect(priority).toHaveDisplayValue([`patient.careGoal.priority.${expectedPriority}`])
    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(1)
    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ priority: expectedPriority })
  })

  it('should render a status selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.status/i)).toBeInTheDocument()

    const status = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    expect(status).toBeInTheDocument()
    expect(status).toHaveValue(careGoal.status)

    userEvent.click(status) // display popup with the options
    Object.values(CareGoalStatus).forEach((value) =>
      expect(screen.getByText(value)).toBeInTheDocument(),
    )

    userEvent.click(screen.getByText(CareGoalStatus.Proposed))
    expect(status).toHaveValue(CareGoalStatus.Proposed)
    expect(screen.queryByText(CareGoalStatus.Accepted)).not.toBeInTheDocument()
  })

  it('should call onChange handler when status changes', () => {
    const expectedStatus = CareGoalStatus.OnHold
    const { onCareGoalChangeSpy } = setup(false, false)

    const status = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    userEvent.type(status, `${expectedStatus}${arrowDown}${enter}`)

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ status: expectedStatus })
  })

  it('should render the achievement status selector', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.achievementStatus/i)).toBeInTheDocument()

    const achievementStatus = within(screen.getByTestId('achievementStatusSelect')).getByRole(
      'combobox',
    )
    expect(achievementStatus).toBeInTheDocument()
    expect(achievementStatus).toHaveValue(careGoal.achievementStatus)
  })

  it('should call onChange handler when achievement status change', () => {
    const expectedAchievementStatus = CareGoalAchievementStatus.Improving
    const { onCareGoalChangeSpy } = setup(false, false)

    const status = within(screen.getByTestId('achievementStatusSelect')).getByRole('combobox')
    userEvent.type(status, `${expectedAchievementStatus}${arrowDown}${enter}`)

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({
      achievementStatus: expectedAchievementStatus,
    })
  })

  it('should render a start date picker', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.startDate/i)).toBeInTheDocument()
    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    expect(startDatePicker).toBeInTheDocument()
    expect(startDatePicker).toHaveValue(format(startDate, 'MM/dd/y'))
  })

  it('should call onChange handler when start date change', () => {
    const { onCareGoalChangeSpy } = setup()
    const expectedDate = '12/31/2050'

    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    userEvent.type(startDatePicker, `{selectall}${expectedDate}{enter}`)
    expect(onCareGoalChangeSpy).toHaveBeenCalled()
    expect(startDatePicker).toHaveDisplayValue(expectedDate)
  })

  it('should render a due date picker', () => {
    setup()

    expect(screen.getByText(/patient.careGoal.dueDate/i)).toBeInTheDocument()
    const dueDatePicker = within(screen.getByTestId('dueDateDatePicker')).getByRole('textbox')
    expect(dueDatePicker).toBeInTheDocument()
    expect(dueDatePicker).toHaveValue(format(dueDate, 'MM/dd/y'))
  })

  it('should call onChange handler when due date changes', () => {
    const { onCareGoalChangeSpy } = setup()
    const expectedDate = '12/31/2050'

    const dueDatePicker = within(screen.getByTestId('dueDateDatePicker')).getByRole('textbox')
    userEvent.type(dueDatePicker, `{selectall}${expectedDate}{enter}`)
    expect(onCareGoalChangeSpy).toHaveBeenCalled()
    expect(dueDatePicker).toHaveDisplayValue(expectedDate)
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
    expect(noteInput).toHaveDisplayValue(expectedNote)

    expect(onCareGoalChangeSpy).toHaveBeenCalledTimes(expectedNote.length)
  })

  it('should render all the forms fields disabled if the form is disabled', () => {
    setup(true)

    const descriptionInput = screen.getByLabelText(/patient\.careGoal\.description/i)
    const priority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')
    const status = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    const achievementStatus = within(screen.getByTestId('achievementStatusSelect')).getByRole(
      'combobox',
    )
    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    const dueDatePicker = within(screen.getByTestId('dueDateDatePicker')).getByRole('textbox')
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
    const priority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')
    const status = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    const achievementStatus = within(screen.getByTestId('achievementStatusSelect')).getByRole(
      'combobox',
    )
    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    const dueDatePicker = within(screen.getByTestId('dueDateDatePicker')).getByRole('textbox')
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

    // TODO: not using built-in form accessibility features yet: HTMLInputElement.setCustomValidity()
    // expect((descriptionInput as HTMLInputElement).validity.valid).toBe(false)
    expect(descriptionInput).toHaveClass('is-invalid')
    expect(priority).toHaveClass('is-invalid')
    expect(status).toHaveClass('is-invalid')
    expect(achievementStatus).toHaveClass('is-invalid')
  })
})
