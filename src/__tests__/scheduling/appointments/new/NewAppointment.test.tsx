import '../../../../__mocks__/matchMediaMock'

import * as components from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { mount } from 'enzyme'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import AppointmentRepository from '../../../../clients/db/AppointmentRepository'
import LabRepository from '../../../../clients/db/LabRepository'
import Appointment from '../../../../model/Appointment'
import Lab from '../../../../model/Lab'
import Patient from '../../../../model/Patient'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'
import AppointmentDetailForm from '../../../../scheduling/appointments/AppointmentDetailForm'
import NewAppointment from '../../../../scheduling/appointments/new/NewAppointment'
import { RootState } from '../../../../store'

const mockStore = createMockStore<RootState, any>([thunk])
const mockedComponents = mocked(components, true)

describe('New Appointment', () => {
  let history: MemoryHistory
  let store: MockStore
  const expectedNewAppointment = { id: '123' }

  const setup = () => {
    jest.spyOn(AppointmentRepository, 'save')
    mocked(AppointmentRepository, true).save.mockResolvedValue(
      expectedNewAppointment as Appointment,
    )
    jest.spyOn(LabRepository, 'findAllByPatientId').mockResolvedValue([] as Lab[])

    history = createMemoryHistory()
    store = mockStore({
      appointment: {
        appointment: {} as Appointment,
        patient: {} as Patient,
      },
    } as any)

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

      expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.new')
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
        patient: '123',
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
        onFieldChange('patientId', expectedAppointment.patient)
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

      const saveButton = wrapper.find(mockedComponents.Button).at(0)
      expect(saveButton.text().trim()).toEqual('actions.save')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })

      expect(AppointmentRepository.save).toHaveBeenCalledWith(expectedAppointment)
      expect(store.getActions()).toContainEqual(appointmentSlice.createAppointmentStart())
      expect(store.getActions()).toContainEqual(appointmentSlice.createAppointmentSuccess())
    })

    it('should navigate to /appointments/:id when a new appointment is created', async () => {
      jest.spyOn(components, 'Toast')
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      const expectedAppointment = {
        patient: '123',
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
        onFieldChange('patientId', expectedAppointment.patient)
      })
      wrapper.update()
      const saveButton = wrapper.find(mockedComponents.Button).at(0)
      expect(saveButton.text().trim()).toEqual('actions.save')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })

      expect(history.location.pathname).toEqual(`/appointments/${expectedNewAppointment.id}`)
      expect(mockedComponents.Toast).toHaveBeenCalledWith(
        'success',
        'states.success',
        `scheduling.appointment.successfullyCreated`,
      )
    })
  })

  describe('on cancel click', () => {
    it('should navigate back to /appointments', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      const cancelButton = wrapper.find(mockedComponents.Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
