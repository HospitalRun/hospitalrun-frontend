import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import Appointment from 'model/Appointment'
import { createMemoryHistory } from 'history'
import AppointmentRepository from 'clients/db/AppointmentsRepository'

import appointments, {
  createAppointmentStart,
  createAppointment,
  getAppointmentsStart,
  getAppointmentsSuccess,
  fetchAppointments,
} from '../../scheduling/appointments/appointments-slice'

describe('appointments slice', () => {
  describe('appointments reducer', () => {
    it('should create the initial state properly', () => {
      const appointmentsStore = appointments(undefined, {} as AnyAction)

      expect(appointmentsStore.isLoading).toBeFalsy()
    })
    it('should handle the CREATE_APPOINTMENT_START action', () => {
      const appointmentsStore = appointments(undefined, {
        type: createAppointmentStart.type,
      })

      expect(appointmentsStore.isLoading).toBeTruthy()
    })

    it('should handle the GET_APPOINTMENTS_START action', () => {
      const appointmentsStore = appointments(undefined, {
        type: getAppointmentsStart.type,
      })

      expect(appointmentsStore.isLoading).toBeTruthy()
    })

    it('should handle the GET_APPOINTMENTS_SUCCESS action', () => {
      const expectedAppointments = [
        {
          patientId: '1234',
          startDateTime: new Date().toISOString(),
          endDateTime: new Date().toISOString(),
        },
      ]
      const appointmentsStore = appointments(undefined, {
        type: getAppointmentsSuccess.type,
        payload: expectedAppointments,
      })

      expect(appointmentsStore.isLoading).toBeFalsy()
      expect(appointmentsStore.appointments).toEqual(expectedAppointments)
    })
  })

  describe('fetchAppointments()', () => {
    let findAllSpy = jest.spyOn(AppointmentRepository, 'findAll')
    const expectedAppointments: Appointment[] = [
      {
        id: '1',
        rev: '1',
        patientId: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        location: 'location',
        type: 'type',
        reason: 'reason',
      },
    ]

    beforeEach(() => {
      findAllSpy = jest.spyOn(AppointmentRepository, 'findAll')
      mocked(AppointmentRepository, true).findAll.mockResolvedValue(
        expectedAppointments as Appointment[],
      )
    })

    it('should dispatch the GET_APPOINTMENTS_START event', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: getAppointmentsStart.type })
    })

    it('should call the AppointmentsRepository findAll() function', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(findAllSpy).toHaveBeenCalled()
    })

    it('should dispatch the GET_APPOINTMENTS_SUCCESS event', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: getAppointmentsSuccess.type,
        payload: expectedAppointments,
      })
    })
  })

  describe('createAppointments()', () => {
    it('should dispatch the CREATE_APPOINTMENT_START action', async () => {
      jest.spyOn(AppointmentRepository, 'save')
      mocked(AppointmentRepository, true).save.mockResolvedValue({ id: '123' } as Appointment)
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedAppointment = {
        patientId: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        location: 'location',
        type: 'type',
        reason: 'reason',
      } as Appointment

      await createAppointment(expectedAppointment, createMemoryHistory())(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createAppointmentStart.type })
    })

    it('should call the the AppointmentRepository save function with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const appointmentRepositorySaveSpy = jest.spyOn(AppointmentRepository, 'save')
      mocked(AppointmentRepository, true).save.mockResolvedValue({ id: '123' } as Appointment)

      const expectedAppointment = {
        patientId: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        location: 'location',
        type: 'type',
        reason: 'reason',
      } as Appointment

      await createAppointment(expectedAppointment, createMemoryHistory())(dispatch, getState, null)

      expect(appointmentRepositorySaveSpy).toHaveBeenCalled()
      expect(appointmentRepositorySaveSpy).toHaveBeenCalledWith(expectedAppointment)
    })

    it('should navigate the /appointments when an appointment is successfully created', async () => {
      jest.spyOn(AppointmentRepository, 'save')
      mocked(AppointmentRepository, true).save.mockResolvedValue({ id: '123' } as Appointment)
      const dispatch = jest.fn()
      const getState = jest.fn()
      const history = createMemoryHistory()

      const expectedAppointment = {
        patientId: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        location: 'location',
        type: 'type',
        reason: 'reason',
      } as Appointment

      await createAppointment(expectedAppointment, history)(dispatch, getState, null)

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
