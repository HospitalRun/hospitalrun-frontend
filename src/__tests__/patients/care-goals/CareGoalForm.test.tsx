import { Alert } from '@hospitalrun/components'
import { addMonths, addDays } from 'date-fns'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import CareGoalForm from '../../../patients/care-goals/CareGoalForm'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'

describe('Care Goal Form', () => {
  const onCareGoalChangeSpy = jest.fn()
  const careGoal = {
    description: 'some description',
    startDate: new Date().toISOString(),
    dueDate: addMonths(new Date(), 1).toISOString(),
    note: '',
    priority: 'medium',
    status: CareGoalStatus.Accepted,
    achievementStatus: CareGoalAchievementStatus.InProgress,
  } as CareGoal

  const setup = (disabled = false, initializeCareGoal = true, error?: any) => {
    const wrapper = mount(
      <CareGoalForm
        careGoal={initializeCareGoal ? careGoal : {}}
        disabled={disabled}
        careGoalError={error}
        onChange={onCareGoalChangeSpy}
      />,
    )

    return wrapper
  }

  it('should render a description input', () => {
    const wrapper = setup()

    const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')

    expect(descriptionInput).toHaveLength(1)
    expect(descriptionInput.prop('label')).toEqual('patient.careGoal.description')
    expect(descriptionInput.prop('isRequired')).toBeTruthy()
    expect(descriptionInput.prop('value')).toBe(careGoal.description)
  })

  it('should call onChange handler when description changes', () => {
    const expectedDescription = 'some new description'
    const wrapper = setup(false, false)

    act(() => {
      const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
      const onChange = descriptionInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedDescription } })
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ description: expectedDescription })
  })

  it('should render a priority selector', () => {
    const wrapper = setup()

    const priority = wrapper.findWhere((w) => w.prop('name') === 'priority')

    expect(priority).toHaveLength(1)
    expect(priority.prop('label')).toEqual('patient.careGoal.priority.label')
    expect(priority.prop('isRequired')).toBeTruthy()
    expect(priority.prop('defaultSelected')[0].value).toBe(careGoal.priority)
    expect(priority.prop('options')).toEqual([
      {
        label: 'patient.careGoal.priority.low',
        value: 'low',
      },
      {
        label: 'patient.careGoal.priority.medium',
        value: 'medium',
      },
      {
        label: 'patient.careGoal.priority.high',
        value: 'high',
      },
    ])
  })

  it('should call onChange handler when priority changes', () => {
    const expectedPriority = 'high'
    const wrapper = setup(false, false)

    act(() => {
      const prioritySelector = wrapper.findWhere((w) => w.prop('name') === 'priority')
      const onChange = prioritySelector.prop('onChange') as any
      onChange([expectedPriority])
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ priority: expectedPriority })
  })

  it('should render a status selector', () => {
    const wrapper = setup()

    const status = wrapper.findWhere((w) => w.prop('name') === 'status')

    expect(status).toHaveLength(1)
    expect(status.prop('label')).toEqual('patient.careGoal.status')
    expect(status.prop('isRequired')).toBeTruthy()
    expect(status.prop('defaultSelected')[0].value).toBe(careGoal.status)
    expect(status.prop('options')).toEqual(
      Object.values(CareGoalStatus).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call onChange handler when status changes', () => {
    const expectedStatus = CareGoalStatus.OnHold
    const wrapper = setup(false, false)

    act(() => {
      const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
      const onChange = statusSelector.prop('onChange') as any
      onChange([expectedStatus])
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ status: expectedStatus })
  })

  it('should render the achievement status selector', () => {
    const wrapper = setup()

    const achievementStatus = wrapper.findWhere((w) => w.prop('name') === 'achievementStatus')
    expect(achievementStatus).toHaveLength(1)
    expect(achievementStatus.prop('label')).toEqual('patient.careGoal.achievementStatus')
    expect(achievementStatus.prop('isRequired')).toBeTruthy()
    expect(achievementStatus.prop('defaultSelected')[0].value).toBe(careGoal.achievementStatus)
    expect(achievementStatus.prop('options')).toEqual(
      Object.values(CareGoalAchievementStatus).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call onChange handler when achievement status change', () => {
    const expectedAchievementStatus = CareGoalAchievementStatus.Improving
    const wrapper = setup(false, false)

    act(() => {
      const achievementStatusSelector = wrapper.findWhere(
        (w) => w.prop('name') === 'achievementStatus',
      )
      const onChange = achievementStatusSelector.prop('onChange') as any
      onChange([expectedAchievementStatus])
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({
      achievementStatus: expectedAchievementStatus,
    })
  })

  it('should render a start date picker', () => {
    const wrapper = setup()

    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    expect(startDatePicker).toHaveLength(1)
    expect(startDatePicker.prop('label')).toEqual('patient.careGoal.startDate')
    expect(startDatePicker.prop('isRequired')).toBeTruthy()
    expect(startDatePicker.prop('value')).toEqual(new Date(careGoal.startDate))
  })

  it('should call onChange handler when start date change', () => {
    const expectedStartDate = addDays(1, new Date().getDate())
    const wrapper = setup(false, false)

    act(() => {
      const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
      const onChange = startDatePicker.prop('onChange') as any
      onChange(expectedStartDate)
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ startDate: expectedStartDate.toISOString() })
  })

  it('should render a due date picker', () => {
    const wrapper = setup()

    const dueDatePicker = wrapper.findWhere((w) => w.prop('name') === 'dueDate')
    expect(dueDatePicker).toHaveLength(1)
    expect(dueDatePicker.prop('label')).toEqual('patient.careGoal.dueDate')
    expect(dueDatePicker.prop('isRequired')).toBeTruthy()
    expect(dueDatePicker.prop('value')).toEqual(new Date(careGoal.dueDate))
  })

  it('should call onChange handler when due date change', () => {
    const expectedDueDate = addDays(31, new Date().getDate())
    const wrapper = setup(false, false)

    act(() => {
      const dueDatePicker = wrapper.findWhere((w) => w.prop('name') === 'dueDate')
      const onChange = dueDatePicker.prop('onChange') as any
      onChange(expectedDueDate)
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ dueDate: expectedDueDate.toISOString() })
  })

  it('should render a note input', () => {
    const wrapper = setup()

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
    expect(noteInput).toHaveLength(1)
    expect(noteInput.prop('label')).toEqual('patient.careGoal.note')
    expect(noteInput.prop('isRequired')).toBeFalsy()
    expect(noteInput.prop('value')).toEqual(careGoal.note)
  })

  it('should call onChange handler when note change', () => {
    const expectedNote = 'some new note'
    const wrapper = setup(false, false)

    act(() => {
      const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
      const onChange = noteInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNote } })
    })

    expect(onCareGoalChangeSpy).toHaveBeenCalledWith({ note: expectedNote })
  })

  it('should render all the forms fields disabled if the form is disabled', () => {
    const wrapper = setup(true)

    const description = wrapper.findWhere((w) => w.prop('name') === 'description')
    const priority = wrapper.findWhere((w) => w.prop('name') === 'priority')
    const status = wrapper.findWhere((w) => w.prop('name') === 'status')
    const achievementStatus = wrapper.findWhere((w) => w.prop('name') === 'achievementStatus')
    const startDate = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    const dueDate = wrapper.findWhere((w) => w.prop('name') === 'dueDate')
    const note = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(description.prop('isEditable')).toBeFalsy()
    expect(priority.prop('isEditable')).toBeFalsy()
    expect(status.prop('isEditable')).toBeFalsy()
    expect(achievementStatus.prop('isEditable')).toBeFalsy()
    expect(startDate.prop('isEditable')).toBeFalsy()
    expect(dueDate.prop('isEditable')).toBeFalsy()
    expect(note.prop('isEditable')).toBeFalsy()
  })

  it('should render the forms field in an error state', () => {
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

    const wrapper = setup(false, false, expectedError)

    const alert = wrapper.find(Alert)
    const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
    const prioritySelector = wrapper.findWhere((w) => w.prop('name') === 'priority')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const achievementStatusSelector = wrapper.findWhere(
      (w) => w.prop('name') === 'achievementStatus',
    )
    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    const dueDatePicker = wrapper.findWhere((w) => w.prop('name') === 'dueDate')
    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(alert).toHaveLength(1)
    expect(alert.prop('message')).toEqual(expectedError.message)

    expect(descriptionInput.prop('isInvalid')).toBeTruthy()
    expect(descriptionInput.prop('feedback')).toEqual(expectedError.description)

    expect(prioritySelector.prop('isInvalid')).toBeTruthy()
    // expect(prioritySelector.prop('feedback')).toEqual(expectedError.priority)

    expect(statusSelector.prop('isInvalid')).toBeTruthy()
    // expect(statusSelector.prop('feedback')).toEqual(expectedError.status)

    expect(achievementStatusSelector.prop('isInvalid')).toBeTruthy()
    // expect(achievementStatusSelector.prop('feedback')).toEqual(expectedError.achievementStatus)

    expect(startDatePicker.prop('isInvalid')).toBeTruthy()
    expect(startDatePicker.prop('feedback')).toEqual(expectedError.startDate)

    expect(dueDatePicker.prop('isInvalid')).toBeTruthy()
    expect(dueDatePicker.prop('feedback')).toEqual(expectedError.dueDate)

    expect(noteInput.prop('isInvalid')).toBeTruthy()
    expect(noteInput.prop('feedback')).toEqual(expectedError.note)
  })
})
