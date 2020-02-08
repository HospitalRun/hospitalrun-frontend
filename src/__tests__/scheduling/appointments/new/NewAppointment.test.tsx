import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import { MemoryRouter, Router } from 'react-router'
import store from 'store'
import { Provider } from 'react-redux'
import { mount, ReactWrapper } from 'enzyme'
import { Button, Alert } from '@hospitalrun/components'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { createMemoryHistory } from 'history'
import { act } from '@testing-library/react'
import subDays from 'date-fns/subDays'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { mocked } from 'ts-jest/utils'
import Appointment from 'model/Appointment'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
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
    it('should render a Appointment Detail Component', () => {
      expect(wrapper.find(AppointmentDetailForm)).toHaveLength(1)
    })
  })

  describe('on save click', () => {
    it('should call createAppointment with the proper data', () => {
      const expectedAppointmentDetails = {
        patientId: '123',
        startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
        endDateTime: addMinutes(
          roundToNearestMinutes(new Date(), { nearestTo: 15 }),
          60,
        ).toISOString(),
        location: 'location',
        reason: 'reason',
        type: 'type',
      } as Appointment
      const createAppointmentSpy = jest.spyOn(appointmentsSlice, 'createAppointment')

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const appointmentChangeHandler = appointmentDetailForm.prop('onAppointmentChange')
        appointmentChangeHandler(expectedAppointmentDetails)
      })
      wrapper.update()

      act(() => {
        const saveButton = wrapper.find(Button).at(0)
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      expect(createAppointmentSpy).toHaveBeenCalledTimes(1)
      expect(createAppointmentSpy).toHaveBeenCalledWith(
        expectedAppointmentDetails,
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
        const onAppointmentChange = wrapper.find(AppointmentDetailForm).prop('onAppointmentChange')
        onAppointmentChange({
          patientId: expectedPatientId,
          startDateTime: expectedStartDateTime.toISOString(),
          endDateTime: expectedEndDateTime.toISOString(),
        } as Appointment)
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
