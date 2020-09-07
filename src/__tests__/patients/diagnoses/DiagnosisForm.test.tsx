import { Alert } from '@hospitalrun/components'
import { addDays } from 'date-fns'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

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
    visit: 'some visit',
  }

  const patient = {
    givenName: 'first',
    fullName: 'first',
  } as Patient

  const setup = (disabled = false, initializeDiagnosis = true, error?: any) => {
    onDiagnosisChangeSpy = jest.fn()
    const wrapper = mount(
      <DiagnosisForm
        onChange={onDiagnosisChangeSpy}
        diagnosis={initializeDiagnosis ? diagnosis : {}}
        diagnosisError={error}
        disabled={disabled}
        patient={patient}
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

  it('should render a visit selector', () => {
    const { wrapper } = setup()

    const visitSelector = wrapper.findWhere((w) => w.prop('name') === 'visit')

    expect(visitSelector).toHaveLength(1)
    expect(visitSelector.prop('patient.diagnoses.visit'))
    expect(visitSelector.prop('isRequired')).toBeFalsy()
    expect(visitSelector.prop('defaultSelected')).toEqual([])
  })

  it('should call the on change handler when visit changes', () => {
    const expectedNewVisit = patient.visits
    const { wrapper } = setup(false, false)
    act(() => {
      const visitSelector = wrapper.findWhere((w) => w.prop('name') === 'visit')
      const onChange = visitSelector.prop('onChange') as any
      onChange([expectedNewVisit])
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ status: expectedNewVisit })
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

  it('should render a onset date picker', () => {
    const { wrapper } = setup()

    const onsetDatePicker = wrapper.findWhere((w) => w.prop('name') === 'onsetDate')

    expect(onsetDatePicker).toHaveLength(1)
    expect(onsetDatePicker.prop('patient.diagnoses.onsetDate'))
    expect(onsetDatePicker.prop('isRequired')).toBeTruthy()
    expect(onsetDatePicker.prop('value')).toEqual(new Date(diagnosis.onsetDate))
  })

  it('should call the on change handler when onset date changes', () => {
    const expectedNewOnsetDate = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const onsetDatePicker = wrapper.findWhere((w) => w.prop('name') === 'onsetDate')
    act(() => {
      const onChange = onsetDatePicker.prop('onChange') as any
      onChange(expectedNewOnsetDate)
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({
      onsetDate: expectedNewOnsetDate.toISOString(),
    })
  })

  it('should render a abatement date picker', () => {
    const { wrapper } = setup()

    const abatementDatePicker = wrapper.findWhere((w) => w.prop('name') === 'abatementDate')

    expect(abatementDatePicker).toHaveLength(1)
    expect(abatementDatePicker.prop('patient.diagnoses.abatementDate'))
    expect(abatementDatePicker.prop('isRequired')).toBeTruthy()
    expect(abatementDatePicker.prop('value')).toEqual(new Date(diagnosis.abatementDate))
  })

  it('should call the on change handler when abatementDate date changes', () => {
    const expectedNewAbatementDate = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const abatementDatePicker = wrapper.findWhere((w) => w.prop('name') === 'abatementDate')
    act(() => {
      const onChange = abatementDatePicker.prop('onChange') as any
      onChange(expectedNewAbatementDate)
    })

    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({
      abatementDate: expectedNewAbatementDate.toISOString(),
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

  it('should render all of the fields as disabled if the form is disabled', () => {
    const { wrapper } = setup(true)
    const nameInput = wrapper.findWhere((w) => w.prop('name') === 'name')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const diagnosisDatePicker = wrapper.findWhere((w) => w.prop('name') === 'diagnosisDate')
    const onsetDatePicker = wrapper.findWhere((w) => w.prop('name') === 'onsetDate')
    const abatementeDatePicker = wrapper.findWhere((w) => w.prop('name') === 'abatementDate')
    const noteInput = wrapper.findWhere((w) => w.prop('name') === 'note')

    expect(nameInput.prop('isEditable')).toBeFalsy()
    expect(statusSelector.prop('isEditable')).toBeFalsy()
    expect(diagnosisDatePicker.prop('isEditable')).toBeFalsy()
    expect(abatementeDatePicker.prop('isEditable')).toBeFalsy()
    expect(onsetDatePicker.prop('isEditable')).toBeFalsy()
    expect(noteInput.prop('isEditable')).toBeFalsy()
  })

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

    const { wrapper } = setup(false, false, expectedError)

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
