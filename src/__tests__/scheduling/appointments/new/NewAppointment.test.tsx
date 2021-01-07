import * as components from '@hospitalrun/components'
import { Alert, Button, Typeahead } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { mount } from 'enzyme'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../../page-header/title/TitleContext'
import AppointmentDetailForm from '../../../../scheduling/appointments/AppointmentDetailForm'
import NewAppointment from '../../../../scheduling/appointments/new/NewAppointment'
import DateTimePickerWithLabelFormGroup from '../../../../shared/components/input/DateTimePickerWithLabelFormGroup'
import AppointmentRepository from '../../../../shared/db/AppointmentRepository'
import Appointment from '../../../../shared/model/Appointment'
import Patient from '../../../../shared/model/Patient'
import { RootState } from '../../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('New Appointment', () => {
  let history: MemoryHistory
  let store: MockStore
  const expectedNewAppointment = { id: '123' }

  const setup = () => {
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest
      .spyOn(AppointmentRepository, 'save')
      .mockResolvedValue(expectedNewAppointment as Appointment)
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
            <TitleProvider>
              <NewAppointment />
            </TitleProvider>
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  describe('header', () => {
    it('should have called useUpdateTitle hook', async () => {
      await act(async () => {
        await setup()
      })

      expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
    })
  })

  describe('layout', () => {
    it('should render an Appointment Detail Component', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })

      expect(wrapper.find(AppointmentDetailForm)).toHaveLength(1)
    })
  })

  describe('on save click', () => {
    it('should have error when error saving without patient', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })
      const expectedError = {
        message: 'scheduling.appointment.errors.createAppointmentError',
        patient: 'scheduling.appointment.errors.patientRequired',
      }
      const expectedAppointment = {
        patient: '',
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
        onFieldChange('patient', expectedAppointment.patient)
      })

      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton.text().trim()).toEqual('scheduling.appointments.createAppointment')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })
      wrapper.update()
      const alert = wrapper.find(Alert)
      const typeahead = wrapper.find(Typeahead)

      expect(AppointmentRepository.save).toHaveBeenCalledTimes(0)
      expect(alert.prop('message')).toEqual(expectedError.message)
      expect(typeahead.prop('isInvalid')).toBeTruthy()
    })

    it('should have error when error saving with end time earlier than start time', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup()
      })
      const expectedError = {
        message: 'scheduling.appointment.errors.createAppointmentError',
        startDateTime: 'scheduling.appointment.errors.startDateMustBeBeforeEndDate',
      }
      const expectedAppointment = {
        patient: 'Mr Popo',
        startDateTime: new Date(2020, 10, 10, 0, 0, 0, 0).toISOString(),
        endDateTime: new Date(1957, 10, 10, 0, 0, 0, 0).toISOString(),
        location: 'location',
        reason: 'reason',
        type: 'type',
      } as Appointment

      act(() => {
        const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
        const onFieldChange = appointmentDetailForm.prop('onFieldChange')
        onFieldChange('patient', expectedAppointment.patient)
        onFieldChange('startDateTime', expectedAppointment.startDateTime)
        onFieldChange('endDateTime', expectedAppointment.endDateTime)
      })

      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton.text().trim()).toEqual('scheduling.appointments.createAppointment')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })
      wrapper.update()
      const alert = wrapper.find(Alert)
      const typeahead = wrapper.find(Typeahead)
      const dateInput = wrapper.find(DateTimePickerWithLabelFormGroup).at(0)

      expect(AppointmentRepository.save).toHaveBeenCalledTimes(0)
      expect(alert.prop('message')).toEqual(expectedError.message)
      expect(typeahead.prop('isInvalid')).toBeTruthy()
      expect(dateInput.prop('isInvalid')).toBeTruthy()
      expect(dateInput.prop('feedback')).toEqual(expectedError.startDateTime)
    })

    it('should call AppointmentRepo.save when save button is clicked', async () => {
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
        onFieldChange('patient', expectedAppointment.patient)
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
      expect(saveButton.text().trim()).toEqual('scheduling.appointments.createAppointment')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })

      expect(AppointmentRepository.save).toHaveBeenCalledWith(expectedAppointment)
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
        onFieldChange('patient', expectedAppointment.patient)
      })
      wrapper.update()
      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton.text().trim()).toEqual('scheduling.appointments.createAppointment')
      const onClick = saveButton.prop('onClick') as any

      await act(async () => {
        await onClick()
      })

      expect(history.location.pathname).toEqual(`/appointments/${expectedNewAppointment.id}`)
      expect(components.Toast).toHaveBeenCalledWith(
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

      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
