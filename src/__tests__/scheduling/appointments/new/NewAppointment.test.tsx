import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import { Router, Route } from 'react-router'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { Button, Alert } from '@hospitalrun/components'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { createMemoryHistory, MemoryHistory } from 'history'
import { act } from '@testing-library/react'
import subDays from 'date-fns/subDays'
import AppointmentRepository from 'clients/db/AppointmentRepository'
import { mocked } from 'ts-jest/utils'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import Appointment from 'model/Appointment'
import Patient from 'model/Patient'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'

const mockStore = configureMockStore([thunk])

describe('New Appointment', () => {
  let history: MemoryHistory
  let store: MockStore

  const setup = () => {
    jest.spyOn(AppointmentRepository, 'save')
    mocked(AppointmentRepository, true).save.mockResolvedValue({ id: '123' } as Appointment)

    history = createMemoryHistory()
    store = mockStore({
      appointment: {
        appointment: {} as Appointment,
        patient: {} as Patient,
      },
    })

    history.push('/appointments/new')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/new">
            <NewAppointment />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  describe('header', () => {
    it('should use "New Appointment" as the header', async () => {
      jest.spyOn(titleUtil, 'default')
      await act(async () => {
        await setup()
      })

      expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.newAppointment')
    })
  })

  describe('layout', () => {
    it('should render a Appointment Detail Component', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      expect(wrapper.find(AppointmentDetailForm)).toHaveLength(1)
    })
  })

  describe('on save click', () => {
    it('should dispatch createAppointment when save button is clicked', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      const expectedAppointment = {
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

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('patientId', expectedAppointment.patientId)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('startDateTime', expectedAppointment.startDateTime)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('endDateTime', expectedAppointment.endDateTime)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('location', expectedAppointment.location)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('reason', expectedAppointment.reason)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('type', expectedAppointment.type)
      })

      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })

      expect(AppointmentRepository.save).toHaveBeenCalledWith(expectedAppointment)
      expect(store.getActions()).toContainEqual(appointmentSlice.createAppointmentStart())
      expect(store.getActions()).toContainEqual(appointmentSlice.createAppointmentSuccess())
    })

    it('should display an error if there is no patient id', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      act(() => {
        const saveButton = wrapper.find(Button).at(0)
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const alert = wrapper.find(Alert)
      expect(alert).toHaveLength(1)
      expect(alert.prop('message')).toEqual('scheduling.appointment.errors.patientRequired')
    })

    it('should display an error if the end date is before the start date', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      const patientId = '123'
      const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
      const endDateTime = subDays(startDateTime, 1)

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('patientId', patientId)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('startDateTime', startDateTime)
      })

      wrapper.update()

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('endDateTime', endDateTime)
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
    })
  })

  describe('on cancel click', () => {
    it('should navigate back to /appointments', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
