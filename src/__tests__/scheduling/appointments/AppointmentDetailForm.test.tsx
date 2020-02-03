import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import Appointment from 'model/Appointment'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { Typeahead, Button } from '@hospitalrun/components'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import { act } from '@testing-library/react'

describe('AppointmentDetailForm', () => {
  describe('layout', () => {
    let wrapper: ReactWrapper

    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm
          appointment={
            {
              startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
              endDateTime: addMinutes(
                roundToNearestMinutes(new Date(), { nearestTo: 15 }),
                60,
              ).toISOString(),
            } as Appointment
          }
          onAppointmentChange={jest.fn()}
        />,
      )
    })

    it('should render a typeahead for patients', () => {
      const patientTypeahead = wrapper.find(Typeahead)

      expect(patientTypeahead).toHaveLength(1)
      expect(patientTypeahead.prop('placeholder')).toEqual('scheduling.appointment.patient')
    })

    it('should render as start date date time picker', () => {
      const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')

      expect(startDateTimePicker).toHaveLength(1)
      expect(startDateTimePicker.prop('label')).toEqual('scheduling.appointment.startDate')
      expect(startDateTimePicker.prop('value')).toEqual(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
      )
    })

    it('should render an end date time picker', () => {
      const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')

      expect(endDateTimePicker).toHaveLength(1)
      expect(endDateTimePicker.prop('label')).toEqual('scheduling.appointment.endDate')
      expect(endDateTimePicker.prop('value')).toEqual(
        addMinutes(roundToNearestMinutes(new Date(), { nearestTo: 15 }), 60),
      )
    })

    it('should render a location text input box', () => {
      const locationTextInputBox = wrapper.findWhere((w) => w.prop('name') === 'location')

      expect(locationTextInputBox).toHaveLength(1)
      expect(locationTextInputBox.prop('label')).toEqual('scheduling.appointment.location')
    })

    it('should render a type select box', () => {
      const typeSelect = wrapper.findWhere((w) => w.prop('name') === 'type')

      expect(typeSelect).toHaveLength(1)
      expect(typeSelect.prop('label')).toEqual('scheduling.appointment.type')
      expect(typeSelect.prop('options')[0].label).toEqual('scheduling.appointment.types.checkup')
      expect(typeSelect.prop('options')[0].value).toEqual('checkup')
      expect(typeSelect.prop('options')[1].label).toEqual('scheduling.appointment.types.emergency')
      expect(typeSelect.prop('options')[1].value).toEqual('emergency')
      expect(typeSelect.prop('options')[2].label).toEqual('scheduling.appointment.types.followUp')
      expect(typeSelect.prop('options')[2].value).toEqual('follow up')
      expect(typeSelect.prop('options')[3].label).toEqual('scheduling.appointment.types.routine')
      expect(typeSelect.prop('options')[3].value).toEqual('routine')
      expect(typeSelect.prop('options')[4].label).toEqual('scheduling.appointment.types.walkUp')
      expect(typeSelect.prop('options')[4].value).toEqual('walk up')
    })

    it('should render a reason text field input', () => {
      const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')

      expect(reasonTextField).toHaveLength(1)
      expect(reasonTextField.prop('label')).toEqual('scheduling.appointment.reason')
    })
  })

  describe('change handlers', () => {
    let wrapper: ReactWrapper
    let appointment = {
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        30,
      ).toISOString(),
    } as Appointment
    const onAppointmentChangeSpy = jest.fn()

    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm
          appointment={appointment}
          onAppointmentChange={onAppointmentChangeSpy}
        />,
      )
    })

    it('should call the onAppointmentChange when patient input changes', () => {
      const expectedPatientId = '123'

      act(() => {
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: expectedPatientId }] as Patient[])
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        patientId: expectedPatientId,
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
      })
    })

    it('should call the onAppointmentChange when start date time changes', () => {
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })

      act(() => {
        const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
        startDateTimePicker.prop('onChange')(expectedStartDateTime)
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        startDateTime: expectedStartDateTime.toISOString(),
        endDateTime: appointment.endDateTime,
      })
    })

    it('should call the onAppointmentChange when end date time changes', () => {
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
      const expectedEndDateTime = addMinutes(expectedStartDateTime, 30)

      act(() => {
        const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
        endDateTimePicker.prop('onChange')(expectedEndDateTime)
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        startDateTime: appointment.startDateTime,
        endDateTime: expectedEndDateTime.toISOString(),
      })
    })

    it('should call the onAppointmentChange when location changes', () => {
      const expectedLocation = 'location'

      act(() => {
        const locationTextInputBox = wrapper.findWhere((w) => w.prop('name') === 'location')
        locationTextInputBox.prop('onChange')({ target: { value: expectedLocation } })
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
        location: expectedLocation,
      })
    })

    it('should call the onAppointmentChange when type changes', () => {
      const expectedType = 'follow up'

      act(() => {
        const typeSelect = wrapper.findWhere((w) => w.prop('name') === 'type')
        typeSelect.prop('onChange')({ currentTarget: { value: expectedType } })
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
        type: expectedType,
      })
    })

    it('should call the onAppointmentChange when reason changes', () => {
      const expectedReason = 'reason'

      act(() => {
        const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')
        reasonTextField.prop('onChange')({ target: { value: expectedReason } })
      })
      wrapper.update()

      expect(onAppointmentChangeSpy).toHaveBeenLastCalledWith({
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
        reason: expectedReason,
      })
    })
  })

  describe('typeahead search', () => {
    let wrapper: ReactWrapper
    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm
          appointment={
            {
              startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
              endDateTime: addMinutes(
                roundToNearestMinutes(new Date(), { nearestTo: 15 }),
                60,
              ).toISOString(),
            } as Appointment
          }
          onAppointmentChange={jest.fn()}
        />,
      )
    })

    it('should call the PatientRepository search when typeahead changes', () => {
      const patientTypeahead = wrapper.find(Typeahead)
      const patientRepositorySearch = jest.spyOn(PatientRepository, 'search')
      const expectedSearchString = 'search'

      act(() => {
        patientTypeahead.prop('onSearch')(expectedSearchString)
      })

      expect(patientRepositorySearch).toHaveBeenCalledWith(expectedSearchString)
    })
  })
})
