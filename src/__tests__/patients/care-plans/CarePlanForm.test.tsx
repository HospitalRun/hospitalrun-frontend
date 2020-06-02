import '../../../__mocks__/matchMediaMock'
import { addDays } from 'date-fns'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../model/CarePlan'
import Diagnosis from '../../../model/Diagnosis'
import Patient from '../../../model/Patient'
import CarePlanForm from '../../../patients/care-plans/CarePlanForm'

describe('Care Plan Form', () => {
  let onCarePlanChangeSpy: any
  const diagnosis: Diagnosis = {
    id: '123',
    name: 'some diagnosis name',
    diagnosisDate: new Date().toISOString(),
  }
  const carePlan: CarePlan = {
    id: 'id',
    title: 'title',
    description: 'description',
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Option,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    diagnosisId: diagnosis.id,
    createdOn: new Date().toISOString(),
    note: 'note',
  }
  const setup = (disabled = false, initializeCarePlan = true, error?: any) => {
    onCarePlanChangeSpy = jest.fn()
    const mockPatient = { id: '123', diagnoses: [diagnosis] } as Patient
    const wrapper = mount(
      <CarePlanForm
        patient={mockPatient}
        onChange={onCarePlanChangeSpy}
        carePlan={initializeCarePlan ? carePlan : {}}
        disabled={disabled}
        carePlanError={error}
      />,
    )
    return { wrapper }
  }

  it('should render a title input', () => {
    const { wrapper } = setup()

    const titleInput = wrapper.findWhere((w) => w.prop('name') === 'title')

    expect(titleInput).toHaveLength(1)
    expect(titleInput.prop('patient.carePlan.title'))
    expect(titleInput.prop('isRequired')).toBeTruthy()
    expect(titleInput.prop('value')).toEqual(carePlan.title)
  })

  it('should call the on change handler when condition changes', () => {
    const expectedNewTitle = 'some new title'
    const { wrapper } = setup(false, false)
    act(() => {
      const titleInput = wrapper.findWhere((w) => w.prop('name') === 'title')
      const onChange = titleInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewTitle } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ title: expectedNewTitle })
  })

  it('should render a description input', () => {
    const { wrapper } = setup()

    const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')

    expect(descriptionInput).toHaveLength(1)
    expect(descriptionInput.prop('patient.carePlan.description'))
    expect(descriptionInput.prop('isRequired')).toBeTruthy()
    expect(descriptionInput.prop('value')).toEqual(carePlan.description)
  })

  it('should call the on change handler when condition changes', () => {
    const expectedNewDescription = 'some new description'
    const { wrapper } = setup(false, false)
    act(() => {
      const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
      const onChange = descriptionInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewDescription } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ description: expectedNewDescription })
  })

  it('should render a condition selector with the diagnoses from the patient', () => {
    const { wrapper } = setup()

    const conditionSelector = wrapper.findWhere((w) => w.prop('name') === 'condition')

    expect(conditionSelector).toHaveLength(1)
    expect(conditionSelector.prop('patient.carePlan.condition'))
    expect(conditionSelector.prop('isRequired')).toBeTruthy()
    expect(conditionSelector.prop('value')).toEqual(carePlan.diagnosisId)
    expect(conditionSelector.prop('options')).toEqual([
      { value: diagnosis.id, label: diagnosis.name },
    ])
  })

  it('should call the on change handler when condition changes', () => {
    const expectedNewCondition = 'some new condition'
    const { wrapper } = setup(false, false)
    act(() => {
      const conditionSelector = wrapper.findWhere((w) => w.prop('name') === 'condition')
      const onChange = conditionSelector.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewCondition } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ diagnosisId: expectedNewCondition })
  })

  it('should render a status selector', () => {
    const { wrapper } = setup()

    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')

    expect(statusSelector).toHaveLength(1)
    expect(statusSelector.prop('patient.carePlan.status'))
    expect(statusSelector.prop('isRequired')).toBeTruthy()
    expect(statusSelector.prop('value')).toEqual(carePlan.status)
    expect(statusSelector.prop('options')).toEqual(
      Object.values(CarePlanStatus).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call the on change handler when status changes', () => {
    const expectedNewStatus = CarePlanStatus.Revoked
    const { wrapper } = setup(false, false)
    act(() => {
      const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
      const onChange = statusSelector.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewStatus } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ status: expectedNewStatus })
  })

  it('should render an intent selector', () => {
    const { wrapper } = setup()

    const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')

    expect(intentSelector).toHaveLength(1)
    expect(intentSelector.prop('patient.carePlan.intent'))
    expect(intentSelector.prop('isRequired')).toBeTruthy()
    expect(intentSelector.prop('value')).toEqual(carePlan.intent)
    expect(intentSelector.prop('options')).toEqual(
      Object.values(CarePlanIntent).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call the on change handler when intent changes', () => {
    const newIntent = CarePlanIntent.Proposal
    const { wrapper } = setup(false, false)
    act(() => {
      const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')
      const onChange = intentSelector.prop('onChange') as any
      onChange({ currentTarget: { value: newIntent } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ intent: newIntent })
  })

  it('should render a start date picker', () => {
    const { wrapper } = setup()

    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')

    expect(startDatePicker).toHaveLength(1)
    expect(startDatePicker.prop('patient.carePlan.startDate'))
    expect(startDatePicker.prop('isRequired')).toBeTruthy()
    expect(startDatePicker.prop('value')).toEqual(new Date(carePlan.startDate))
  })

  it('should call the on change handler when start date changes', () => {
    const expectedNewStartDate = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    act(() => {
      const onChange = startDatePicker.prop('onChange') as any
      onChange(expectedNewStartDate)
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({
      startDate: expectedNewStartDate.toISOString(),
    })
  })

  it('should render an end date picker', () => {
    const { wrapper } = setup()

    const endDatePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')

    expect(endDatePicker).toHaveLength(1)
    expect(endDatePicker.prop('patient.carePlan.endDate'))
    expect(endDatePicker.prop('isRequired')).toBeTruthy()
    expect(endDatePicker.prop('value')).toEqual(new Date(carePlan.endDate))
  })

  it('should call the on change handler when end date changes', () => {
    const expectedNewEndDate = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const endDatePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
    act(() => {
      const onChange = endDatePicker.prop('onChange') as any
      onChange(expectedNewEndDate)
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({
      endDate: expectedNewEndDate.toISOString(),
    })
  })

  it('should render a note input', () => {
    const { wrapper } = setup()

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
    expect(noteInput).toHaveLength(1)
    expect(noteInput.prop('patient.carePlan.note'))
    expect(noteInput.prop('isRequired')).toBeTruthy()
    expect(noteInput.prop('value')).toEqual(carePlan.note)
  })

  it('should call the on change handler when note changes', () => {
    const expectedNewNote = 'some new note'
    const { wrapper } = setup(false, false)

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
    act(() => {
      const onChange = noteInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewNote } })
    })

    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ note: expectedNewNote })
  })

  it('should render all of the fields as disabled if the form is disabled', () => {
    const { wrapper } = setup(true)
    const titleInput = wrapper.findWhere((w) => w.prop('name') === 'title')
    const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
    const conditionSelector = wrapper.findWhere((w) => w.prop('name') === 'condition')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')
    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    const endDatePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(titleInput.prop('isEditable')).toBeFalsy()
    expect(descriptionInput.prop('isEditable')).toBeFalsy()
    expect(conditionSelector.prop('isEditable')).toBeFalsy()
    expect(statusSelector.prop('isEditable')).toBeFalsy()
    expect(intentSelector.prop('isEditable')).toBeFalsy()
    expect(startDatePicker.prop('isEditable')).toBeFalsy()
    expect(endDatePicker.prop('isEditable')).toBeFalsy()
    expect(noteInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      title: 'some title error',
      description: 'some description error',
      status: 'some status error',
      intent: 'some intent error',
      startDate: 'some start date error',
      endDate: 'some end date error',
      note: 'some note error',
      condition: 'some condition error',
    }

    const { wrapper } = setup(false, false, expectedError)

    const titleInput = wrapper.findWhere((w) => w.prop('name') === 'title')
    const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
    const conditionSelector = wrapper.findWhere((w) => w.prop('name') === 'condition')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')
    const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
    const endDatePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(titleInput.prop('isInvalid')).toBeTruthy()
    expect(titleInput.prop('feedback')).toEqual(expectedError.title)

    expect(descriptionInput.prop('isInvalid')).toBeTruthy()
    expect(descriptionInput.prop('feedback')).toEqual(expectedError.description)

    expect(conditionSelector.prop('isInvalid')).toBeTruthy()
    expect(conditionSelector.prop('feedback')).toEqual(expectedError.condition)

    expect(statusSelector.prop('isInvalid')).toBeTruthy()
    expect(statusSelector.prop('feedback')).toEqual(expectedError.status)

    expect(intentSelector.prop('isInvalid')).toBeTruthy()
    expect(intentSelector.prop('feedback')).toEqual(expectedError.intent)

    expect(startDatePicker.prop('isInvalid')).toBeTruthy()
    expect(startDatePicker.prop('feedback')).toEqual(expectedError.startDate)

    expect(endDatePicker.prop('isInvalid')).toBeTruthy()
    expect(endDatePicker.prop('feedback')).toEqual(expectedError.endDate)

    expect(noteInput.prop('isInvalid')).toBeTruthy()
    expect(noteInput.prop('feedback')).toEqual(expectedError.note)
  })
})
