import { AnyAction } from 'redux'
import Appointment from 'model/Appointment'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { mocked } from 'ts-jest/utils'
import appointment, {
  getAppointmentStart,
  getAppointmentSuccess,
  fetchAppointment,
} from '../../../scheduling/appointments/appointment-slice'

describe('appointment slice', () => {
  describe('appointment reducer', () => {
    it('should create an initial state properly', () => {
      const appointmentStore = appointment(undefined, {} as AnyAction)

      expect(appointmentStore.appointment).toEqual({} as Appointment)
      expect(appointmentStore.isLoading).toBeFalsy()
    })
    it('should handle the GET_APPOINTMENT_START action', () => {
      const appointmentStore = appointment(undefined, {
        type: getAppointmentStart.type,
      })

      expect(appointmentStore.isLoading).toBeTruthy()
    })
    it('should handle the GET_APPOINTMENT_SUCCESS action', () => {
      const expectedAppointment = {
        patientId: '1234',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
      }
      const appointmentStore = appointment(undefined, {
        type: getAppointmentSuccess.type,
        payload: expectedAppointment,
      })

      expect(appointmentStore.isLoading).toBeFalsy()
      expect(appointmentStore.appointment).toEqual(expectedAppointment)
    })
  })

  describe('fetchAppointment()', () => {
    let findSpy = jest.spyOn(AppointmentRepository, 'find')
    const expectedAppointment: Appointment = {
      id: '1',
      rev: '1',
      patientId: '123',
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      location: 'location',
      type: 'type',
      reason: 'reason',
    }

    beforeEach(() => {
      jest.resetAllMocks()
      findSpy = jest.spyOn(AppointmentRepository, 'find')
      mocked(AppointmentRepository, true).find.mockResolvedValue(expectedAppointment)
    })

    it('should dispatch the GET_APPOINTMENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointment('id')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: getAppointmentStart.type })
    })

    it('should call appointment repository find', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedId = '1234'
      await fetchAppointment(expectedId)(dispatch, getState, null)

      expect(findSpy).toHaveBeenCalledTimes(1)
      expect(findSpy).toHaveBeenCalledWith(expectedId)
    })

    it('should dispatch the GET_APPOINTMENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointment('id')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: getAppointmentSuccess.type,
        payload: expectedAppointment,
      })
    })
  })
})
