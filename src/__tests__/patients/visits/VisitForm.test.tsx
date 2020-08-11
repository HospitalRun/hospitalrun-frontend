import { Alert } from '@hospitalrun/components'
import { addDays } from 'date-fns'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import VisitForm from '../../../patients/visits/VisitForm'
import Patient from '../../../shared/model/Patient'
import Visit, { VisitStatus } from '../../../shared/model/Visit'

describe('Visit Form', () => {
  let onVisitChangeSpy: any

  const visit: Visit = {
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    type: 'emergency',
    status: VisitStatus.Arrived,
    reason: 'routine visit',
    location: 'main',
  }
  const setup = (disabled = false, initializeVisit = true, error?: any) => {
    onVisitChangeSpy = jest.fn()
    const mockPatient = { id: '123' } as Patient
    const wrapper = mount(
      <VisitForm
        patient={mockPatient}
        onChange={onVisitChangeSpy}
        visit={initializeVisit ? visit : {}}
        disabled={disabled}
        visitError={error}
      />,
    )
    return { wrapper }
  }

  it('should render a start date picker', () => {
    const { wrapper } = setup()

    const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDateTime')

    expect(startDateTimePicker).toHaveLength(1)
    expect(startDateTimePicker.prop('patient.visit.startDateTime'))
    expect(startDateTimePicker.prop('isRequired')).toBeTruthy()
    expect(startDateTimePicker.prop('value')).toEqual(new Date(visit.startDateTime))
  })

  it('should call the on change handler when start date changes', () => {
    const expectedNewStartDateTime = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDateTime')
    act(() => {
      const onChange = startDateTimePicker.prop('onChange') as any
      onChange(expectedNewStartDateTime)
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({
      startDateTime: expectedNewStartDateTime.toISOString(),
    })
  })

  it('should render an end date picker', () => {
    const { wrapper } = setup()

    const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDateTime')

    expect(endDateTimePicker).toHaveLength(1)
    expect(endDateTimePicker.prop('patient.visit.endDateTime'))
    expect(endDateTimePicker.prop('isRequired')).toBeTruthy()
    expect(endDateTimePicker.prop('value')).toEqual(new Date(visit.endDateTime))
  })

  it('should call the on change handler when end date changes', () => {
    const expectedNewEndDateTime = addDays(1, new Date().getDate())
    const { wrapper } = setup(false, false)

    const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDateTime')
    act(() => {
      const onChange = endDateTimePicker.prop('onChange') as any
      onChange(expectedNewEndDateTime)
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({
      endDateTime: expectedNewEndDateTime.toISOString(),
    })
  })

  it('should render a type input', () => {
    const { wrapper } = setup()

    const typeInput = wrapper.findWhere((w) => w.prop('name') === 'type')
    expect(typeInput).toHaveLength(1)
    expect(typeInput.prop('patient.visit.type'))
    expect(typeInput.prop('value')).toEqual(visit.type)
  })

  it('should call the on change handler when type changes', () => {
    const expectedNewType = 'some new type'
    const { wrapper } = setup(false, false)

    const typeInput = wrapper.findWhere((w) => w.prop('name') === 'type')
    act(() => {
      const onChange = typeInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewType } })
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ type: expectedNewType })
  })

  it('should render a status selector', () => {
    const { wrapper } = setup()

    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')

    expect(statusSelector).toHaveLength(1)
    expect(statusSelector.prop('patient.visit.status'))
    expect(statusSelector.prop('isRequired')).toBeTruthy()
    expect(statusSelector.prop('defaultSelected')[0].value).toEqual(visit.status)
    expect(statusSelector.prop('options')).toEqual(
      Object.values(VisitStatus).map((v) => ({ label: v, value: v })),
    )
  })

  it('should call the on change handler when status changes', () => {
    const expectedNewStatus = VisitStatus.Finished
    const { wrapper } = setup(false, false)
    act(() => {
      const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
      const onChange = statusSelector.prop('onChange') as any
      onChange([expectedNewStatus])
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ status: expectedNewStatus })
  })

  it('should render a reason input', () => {
    const { wrapper } = setup()

    const reasonInput = wrapper.findWhere((w) => w.prop('name') === 'reason')

    expect(reasonInput).toHaveLength(1)
    expect(reasonInput.prop('patient.visit.reason'))
    expect(reasonInput.prop('isRequired')).toBeTruthy()
    expect(reasonInput.prop('value')).toEqual(visit.reason)
  })

  it('should call the on change handler when reason changes', () => {
    const expectedNewReason = 'some new reason'
    const { wrapper } = setup(false, false)
    act(() => {
      const reasonInput = wrapper.findWhere((w) => w.prop('name') === 'reason')
      const onChange = reasonInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewReason } })
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ reason: expectedNewReason })
  })

  it('should render a location input', () => {
    const { wrapper } = setup()

    const locationInput = wrapper.findWhere((w) => w.prop('name') === 'location')

    expect(locationInput).toHaveLength(1)
    expect(locationInput.prop('patient.visit.location'))
    expect(locationInput.prop('isRequired')).toBeTruthy()
    expect(locationInput.prop('value')).toEqual(visit.location)
  })

  it('should call the on change handler when location changes', () => {
    const expectedNewLocation = 'some new location'
    const { wrapper } = setup(false, false)
    act(() => {
      const locationInput = wrapper.findWhere((w) => w.prop('name') === 'location')
      const onChange = locationInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewLocation } })
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ location: expectedNewLocation })
  })

  it('should render all of the fields as disabled if the form is disabled', () => {
    const { wrapper } = setup(true)
    const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDateTime')
    const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDateTime')
    const typeInput = wrapper.findWhere((w) => w.prop('name') === 'type')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const reasonInput = wrapper.findWhere((w) => w.prop('name') === 'reason')
    const locationInput = wrapper.findWhere((w) => w.prop('name') === 'location')

    expect(startDateTimePicker.prop('isEditable')).toBeFalsy()
    expect(endDateTimePicker.prop('isEditable')).toBeFalsy()
    expect(typeInput.prop('isEditable')).toBeFalsy()
    expect(statusSelector.prop('isEditable')).toBeFalsy()
    expect(reasonInput.prop('isEditable')).toBeFalsy()
    expect(locationInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      message: 'error message',
      startDateTime: 'start date error',
      endDateTime: 'end date error',
      type: 'type error',
      status: 'status error',
      reason: 'reason error',
      location: 'location error',
    }

    const { wrapper } = setup(false, false, expectedError)

    const alert = wrapper.find(Alert)
    const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDateTime')
    const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDateTime')
    const typeInput = wrapper.findWhere((w) => w.prop('name') === 'type')
    const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
    const reasonInput = wrapper.findWhere((w) => w.prop('name') === 'reason')
    const locationInput = wrapper.findWhere((w) => w.prop('name') === 'location')

    expect(alert).toHaveLength(1)
    expect(alert.prop('message')).toEqual(expectedError.message)

    expect(startDateTimePicker.prop('isInvalid')).toBeTruthy()
    expect(startDateTimePicker.prop('feedback')).toEqual(expectedError.startDateTime)

    expect(endDateTimePicker.prop('isInvalid')).toBeTruthy()
    expect(endDateTimePicker.prop('feedback')).toEqual(expectedError.endDateTime)

    expect(typeInput.prop('isInvalid')).toBeTruthy()
    expect(typeInput.prop('feedback')).toEqual(expectedError.type)

    expect(statusSelector.prop('isInvalid')).toBeTruthy()

    expect(reasonInput.prop('isInvalid')).toBeTruthy()
    expect(reasonInput.prop('feedback')).toEqual(expectedError.reason)

    expect(locationInput.prop('isInvalid')).toBeTruthy()
    expect(locationInput.prop('feedback')).toEqual(expectedError.location)
  })
})
