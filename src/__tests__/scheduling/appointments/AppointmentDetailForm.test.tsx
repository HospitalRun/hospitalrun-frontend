import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import Appointment from 'model/Appointment'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { Typeahead } from '@hospitalrun/components'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import { act } from '@testing-library/react'

describe('AppointmentDetailForm', () => {
  describe('layout - editable', () => {
    let wrapper: ReactWrapper
    const expectedAppointment = {
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        60,
      ).toISOString(),
      reason: 'reason',
      location: 'location',
      type: 'emergency',
    } as Appointment

    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm appointment={expectedAppointment} onFieldChange={jest.fn()} />,
      )
    })

    it('should render a typeahead for patients', () => {
      const patientTypeahead = wrapper.find(Typeahead)

      expect(patientTypeahead).toHaveLength(1)
      expect(patientTypeahead.prop('placeholder')).toEqual('scheduling.appointment.patient')
      expect(patientTypeahead.prop('value')).toEqual(expectedAppointment.patientId)
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
      expect(locationTextInputBox.prop('value')).toEqual(expectedAppointment.location)
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
      expect(typeSelect.prop('options')[4].label).toEqual('scheduling.appointment.types.walkIn')
      expect(typeSelect.prop('options')[4].value).toEqual('walk in')
      expect(typeSelect.prop('value')).toEqual(expectedAppointment.type)
    })

    it('should render a reason text field input', () => {
      const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')

      expect(reasonTextField).toHaveLength(1)
      expect(reasonTextField.prop('label')).toEqual('scheduling.appointment.reason')
    })
  })

  describe('layout - editable but patient prop passed (Edit Appointment functionality)', () => {
    it('should disable patient typeahead if patient prop passed', () => {
      const expectedAppointment = {
        startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
        endDateTime: addMinutes(
          roundToNearestMinutes(new Date(), { nearestTo: 15 }),
          60,
        ).toISOString(),
      } as Appointment

      const wrapper = mount(
        <AppointmentDetailForm
          isEditable
          appointment={expectedAppointment}
          patient={{} as Patient}
          onFieldChange={jest.fn()}
        />,
      )
      const patientTypeahead = wrapper.find(Typeahead)
      expect(patientTypeahead.prop('disabled')).toBeTruthy()
    })
  })

  describe('layout - not editable', () => {
    let wrapper: ReactWrapper
    const expectedAppointment = {
      patientId: 'patientId',
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        60,
      ).toISOString(),
    } as Appointment

    const expectedPatient = {
      id: '123',
      fullName: 'full name',
    } as Patient

    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm
          isEditable={false}
          appointment={expectedAppointment}
          patient={expectedPatient}
          onFieldChange={jest.fn()}
        />,
      )
    })
    it('should disable fields', () => {
      const patientTypeahead = wrapper.find(Typeahead)
      const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
      const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
      const locationTextInputBox = wrapper.findWhere((w) => w.prop('name') === 'location')
      const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')
      const typeSelect = wrapper.findWhere((w) => w.prop('name') === 'type')

      expect(patientTypeahead).toHaveLength(1)
      expect(patientTypeahead.prop('disabled')).toBeTruthy()
      expect(patientTypeahead.prop('value')).toEqual(expectedPatient.fullName)
      expect(startDateTimePicker.prop('isEditable')).toBeFalsy()
      expect(endDateTimePicker.prop('isEditable')).toBeFalsy()
      expect(locationTextInputBox.prop('isEditable')).toBeFalsy()
      expect(reasonTextField.prop('isEditable')).toBeFalsy()
      expect(typeSelect.prop('isEditable')).toBeFalsy()
    })
  })

  describe('change handlers', () => {
    let wrapper: ReactWrapper
    const appointment = {
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        30,
      ).toISOString(),
    } as Appointment
    const onFieldChange = jest.fn()

    beforeEach(() => {
      wrapper = mount(
        <AppointmentDetailForm appointment={appointment} onFieldChange={onFieldChange} />,
      )
    })

    it('should call onFieldChange when patient input changes', () => {
      const expectedPatientId = '123'

      act(() => {
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: expectedPatientId }] as Patient[])
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith('patientId', expectedPatientId)
    })

    it('should call onFieldChange when start date time changes', () => {
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })

      act(() => {
        const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
        startDateTimePicker.prop('onChange')(expectedStartDateTime)
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith(
        'startDateTime',
        expectedStartDateTime.toISOString(),
      )
    })

    it('should call onFieldChange when end date time changes', () => {
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
      const expectedEndDateTime = addMinutes(expectedStartDateTime, 30)

      act(() => {
        const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
        endDateTimePicker.prop('onChange')(expectedEndDateTime)
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith(
        'endDateTime',
        expectedEndDateTime.toISOString(),
      )
    })

    it('should call onFieldChange when location changes', () => {
      const expectedLocation = 'location'

      act(() => {
        const locationTextInputBox = wrapper.findWhere((w) => w.prop('name') === 'location')
        locationTextInputBox.prop('onChange')({ target: { value: expectedLocation } })
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith('location', expectedLocation)
    })

    it('should call onFieldChange when type changes', () => {
      const expectedType = 'follow up'

      act(() => {
        const typeSelect = wrapper.findWhere((w) => w.prop('name') === 'type')
        typeSelect.prop('onChange')({ target: { value: expectedType } })
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith('type', expectedType)
    })

    it('should call onFieldChange when reason changes', () => {
      const expectedReason = 'reason'

      act(() => {
        const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')
        reasonTextField.prop('onChange')({ currentTarget: { value: expectedReason } })
      })
      wrapper.update()

      expect(onFieldChange).toHaveBeenLastCalledWith('reason', expectedReason)
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
          onFieldChange={jest.fn()}
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
