import { Alert } from '@hospitalrun/components'
import { addDays } from 'date-fns'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'

describe('Diagnosis Form', () => {
  let onDiagnosisChangeSpy: any
  const diagnosis: Diagnosis = {
    id: '123',
    name: 'some diagnosis name',
    diagnosisDate: new Date().toISOString(),
    onsetDate: new Date().toISOString(),
    abatementDate: new Date().toISOString(),
    status: DiagnosisStatus.Active,
    note: 'some note',
  }

  const setup = (initializeDiagnosis = true, error?: any) => {
    onDiagnosisChangeSpy = jest.fn()
    const wrapper = mount(
      <DiagnosisForm
        onChange={onDiagnosisChangeSpy}
        diagnosis={initializeDiagnosis ? diagnosis : {}}
        diagnosisError={error}
      />,
    )
    return { wrapper }
  }

  it('should render a name input', () => {
    const { wrapper } = setup()

    const nameInput = wrapper.findWhere((w) => w.prop('name') === 'name')

    expect(nameInput).toHaveLength(1)
    expect(nameInput.prop('patient.diagnoses.name'))
    expect(nameInput.prop('isRequired')).toBeTruthy()
    expect(nameInput.prop('value')).toEqual(diagnosis.name)
  })

  it('should call the on change handler when name changes', () => {
    const expectedNewname = 'some new name'
    const { wrapper } = setup(false, false)
    act(() => {
      const nameInput = wrapper.findWhere((w) => w.prop('name') === 'name')
      const onChange = nameInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewname } })
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ name: expectedNewname })
  })

  it('should render a status selector', () => {
    const { wrapper } = setup()

    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')

    expect(statusSelector).toHaveLength(1)
    expect(statusSelector.prop('patient.diagnoses.status'))
    expect(statusSelector.prop('isRequired')).toBeTruthy()
    expect(statusSelector.prop('defaultSelected')[0].value).toEqual(diagnosis.status)
    expect(statusSelector.prop('options')).toEqual(
      Object.values(DiagnosisStatus).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call the on change handler when status changes', () => {
    const expectedNewStatus = DiagnosisStatus.Active
    const { wrapper } = setup(false, false)
    act(() => {
      const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
      const onChange = statusSelector.prop('onChange') as any
      onChange([expectedNewStatus])
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ status: expectedNewStatus })
  })

  // it('should render an intent selector', () => {
  //   const { wrapper } = setup()

  //   const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')

  //   expect(intentSelector).toHaveLength(1)
  //   expect(intentSelector.prop('patient.carePlan.intent'))
  //   expect(intentSelector.prop('isRequired')).toBeTruthy()
  //   expect(intentSelector.prop('defaultSelected')[0].value).toEqual(carePlan.intent)
  //   expect(intentSelector.prop('options')).toEqual(
  //     Object.values(CarePlanIntent).map((v) => ({ label: v, value: v })),
  //   )
  // })

  // it('should call the on change handler when intent changes', () => {
  //   const newIntent = CarePlanIntent.Proposal
  //   const { wrapper } = setup(false, false)
  //   act(() => {
  //     const intentSelector = wrapper.findWhere((w) => w.prop('name') === 'intent')
  //     const onChange = intentSelector.prop('onChange') as any
  //     onChange([newIntent])
  //   })

  //   expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ intent: newIntent })
  // })

  it('should render a diagnosis date picker', () => {
    const { wrapper } = setup()

    const diagnosisDatePicker = wrapper.findWhere((w) => w.prop('name') === 'diagnosisDate')

    expect(diagnosisDatePicker).toHaveLength(1)
    expect(diagnosisDatePicker.prop('patient.diagnoses.diagnosisDate'))
    expect(diagnosisDatePicker.prop('isRequired')).toBeTruthy()
    expect(diagnosisDatePicker.prop('value')).toEqual(new Date(diagnosis.diagnosisDate))
  })

  it('should call the on change handler when diagnosis date changes', () => {
    const expectedNewDiagnosisDate = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const diagnosisDatePicker = wrapper.findWhere((w) => w.prop('name') === 'diagnosisDate')
    act(() => {
      const onChange = diagnosisDatePicker.prop('onChange') as any
      onChange(expectedNewDiagnosisDate)
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({
      diagnosisDate: expectedNewDiagnosisDate.toISOString(),
    })
  })

  it('should render a note input', () => {
    const { wrapper } = setup()

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
    expect(noteInput).toHaveLength(1)
    expect(noteInput.prop('patient.diagnoses.note'))
    expect(noteInput.prop('value')).toEqual(diagnosis.note)
  })

  it('should call the on change handler when note changes', () => {
    const expectedNewNote = 'some new note'
    const { wrapper } = setup(false, false)

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')
    act(() => {
      const onChange = noteInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewNote } })
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ note: expectedNewNote })
  })

  // it('should render all of the fields as disabled if the form is disabled', () => {
  //   const { wrapper } = setup(true)
  //   const nameInput = wrapper.findWhere((w) => w.prop('name') === 'name')
  //   const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
  //   const conditionSelector = wrapper.findWhere((w) => w.prop('name') === 'condition')
  //   const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
  //   const startDatePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
  //   const endDatePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
  //   const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

  //   expect(nameInput.prop('isEditable')).toBeFalsy()
  //   expect(descriptionInput.prop('isEditable')).toBeFalsy()
  //   expect(conditionSelector.prop('isEditable')).toBeFalsy()
  //   expect(statusSelector.prop('isEditable')).toBeFalsy()
  //   expect(startDatePicker.prop('isEditable')).toBeFalsy()
  //   expect(endDatePicker.prop('isEditable')).toBeFalsy()
  //   expect(noteInput.prop('isEditable')).toBeFalsy()
  // })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      message: 'some message error',
      name: 'some name error',
      diagnosisDate: 'some date error',
      onsetDate: 'some date error',
      abatementDate: 'some date error',
      status: 'some status error',
      note: 'some note error',
    }

    const { wrapper } = setup(false, expectedError)

    const alert = wrapper.find(Alert)
    const nameInput = wrapper.findWhere((w) => w.prop('name') === 'name')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const diagnosisDatePicker = wrapper.findWhere((w) => w.prop('name') === 'diagnosisDate')
    const onsetDatePicker = wrapper.findWhere((w) => w.prop('name') === 'onsetDate')
    const abatementDatePicker = wrapper.findWhere((w) => w.prop('name') === 'abatementDate')

    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(alert).toHaveLength(1)
    expect(alert.prop('message')).toEqual(expectedError.message)

    expect(nameInput.prop('isInvalid')).toBeTruthy()
    expect(nameInput.prop('feedback')).toEqual(expectedError.name)

    expect(statusSelector.prop('isInvalid')).toBeTruthy()

    expect(diagnosisDatePicker.prop('isInvalid')).toBeTruthy()
    expect(diagnosisDatePicker.prop('feedback')).toEqual(expectedError.diagnosisDate)

    expect(onsetDatePicker.prop('isInvalid')).toBeTruthy()
    expect(onsetDatePicker.prop('feedback')).toEqual(expectedError.onsetDate)

    expect(abatementDatePicker.prop('isInvalid')).toBeTruthy()
    expect(abatementDatePicker.prop('feedback')).toEqual(expectedError.abatementDate)

    expect(noteInput.prop('isInvalid')).toBeTruthy()
    expect(noteInput.prop('feedback')).toEqual(expectedError.note)
  })
})
