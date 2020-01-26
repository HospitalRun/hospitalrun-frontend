import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import { MemoryRouter, Router } from 'react-router'
import store from 'store'
import { Provider } from 'react-redux'
import { mount, ReactWrapper } from 'enzyme'
import { Typeahead, Button, Alert } from '@hospitalrun/components'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { createMemoryHistory } from 'history'
import { act } from '@testing-library/react'
import subDays from 'date-fns/subDays'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { mocked } from 'ts-jest/utils'
import Appointment from 'model/Appointment'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentsSlice from '../../../../scheduling/appointments/appointments-slice'

describe('New Appointment', () => {
  let wrapper: ReactWrapper
  let history = createMemoryHistory()
  jest.spyOn(AppointmentRepository, 'save')
  mocked(AppointmentRepository, true).save.mockResolvedValue({ id: '123' } as Appointment)

  beforeEach(() => {
    history = createMemoryHistory()
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <NewAppointment />
        </Router>
      </Provider>,
    )
  })

  describe('header', () => {
    it('should use "New Appointment" as the header', () => {
      jest.spyOn(titleUtil, 'default')
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <NewAppointment />
          </MemoryRouter>
        </Provider>,
      )

      expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.new')
    })
  })

  describe('layout', () => {
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

    it('should render a save button', () => {
      const saveButton = wrapper.find(Button).at(0)

      expect(saveButton).toHaveLength(1)
      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', () => {
      const cancelButton = wrapper.find(Button).at(1)

      expect(cancelButton).toHaveLength(1)
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('typeahead search', () => {
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

  describe('on save click', () => {
    it('should call createAppointment with the proper date', () => {
      const createAppointmentSpy = jest.spyOn(appointmentsSlice, 'createAppointment')
      const expectedPatientId = '123'
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
      const expectedEndDateTime = addMinutes(expectedStartDateTime, 30)
      const expectedLocation = 'location'
      const expectedType = 'follow up'
      const expectedReason = 'reason'

      act(() => {
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: expectedPatientId }] as Patient[])
      })
      wrapper.update()

      act(() => {
        const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
        startDateTimePicker.prop('onChange')(expectedStartDateTime)
      })
      wrapper.update()

      act(() => {
        const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
        endDateTimePicker.prop('onChange')(expectedEndDateTime)
      })
      wrapper.update()

      act(() => {
        const locationTextInputBox = wrapper.findWhere((w) => w.prop('name') === 'location')
        locationTextInputBox.prop('onChange')({ target: { value: expectedLocation } })
      })
      wrapper.update()

      act(() => {
        const typeSelect = wrapper.findWhere((w) => w.prop('name') === 'type')
        typeSelect.prop('onChange')({ currentTarget: { value: expectedType } })
      })
      wrapper.update()

      act(() => {
        const reasonTextField = wrapper.findWhere((w) => w.prop('name') === 'reason')
        reasonTextField.prop('onChange')({ target: { value: expectedReason } })
      })
      wrapper.update()

      act(() => {
        const saveButton = wrapper.find(Button).at(0)
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })

      expect(createAppointmentSpy).toHaveBeenCalledTimes(1)
      expect(createAppointmentSpy).toHaveBeenCalledWith(
        {
          patientId: expectedPatientId,
          startDateTime: expectedStartDateTime.toISOString(),
          endDateTime: expectedEndDateTime.toISOString(),
          location: expectedLocation,
          reason: expectedReason,
          type: expectedType,
        },
        expect.anything(),
      )
    })

    it('should display an error if there is no patient id', () => {
      act(() => {
        const saveButton = wrapper.find(Button).at(0)
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const alert = wrapper.find(Alert)
      expect(alert).toHaveLength(1)
      expect(alert.prop('message')).toEqual('scheduling.appointment.errors.patientRequired')
      expect(alert.prop('title')).toEqual('scheduling.appointment.errors.errorCreatingAppointment')
    })

    it('should display an error if the end date is before the start date', () => {
      const expectedPatientId = '123'
      const expectedStartDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
      const expectedEndDateTime = subDays(expectedStartDateTime, 1)

      act(() => {
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: expectedPatientId }] as Patient[])
      })
      wrapper.update()

      act(() => {
        const startDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'startDate')
        startDateTimePicker.prop('onChange')(expectedStartDateTime)
      })
      wrapper.update()

      act(() => {
        const endDateTimePicker = wrapper.findWhere((w) => w.prop('name') === 'endDate')
        endDateTimePicker.prop('onChange')(expectedEndDateTime)
      })
      wrapper.update()

      act(() => {
        const saveButton = wrapper.find(Button).at(0)
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const alert = wrapper.find(Alert)
      expect(alert).toHaveLength(1)
      expect(alert.prop('message')).toEqual(
        'scheduling.appointment.errors.startDateMustBeBeforeEndDate',
      )
      expect(alert.prop('title')).toEqual('scheduling.appointment.errors.errorCreatingAppointment')
    })
  })

  describe('on cancel click', () => {
    it('should navigate back to /appointments', () => {
      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
