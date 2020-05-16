import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'

import AppointmentRepository from '../../../clients/db/AppointmentRepository'
import Appointment from '../../../model/Appointment'
import appointments, {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointments,
} from '../../../scheduling/appointments/appointments-slice'

describe('appointments slice', () => {
  describe('appointments reducer', () => {
    it('should create the initial state properly', () => {
      const appointmentsStore = appointments(undefined, {} as AnyAction)

      expect(appointmentsStore.isLoading).toBeFalsy()
    })

    it('should handle the GET_APPOINTMENTS_START action', () => {
      const appointmentsStore = appointments(undefined, {
        type: fetchAppointmentsStart.type,
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
        type: fetchAppointmentsSuccess.type,
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

    it('should dispatch the FETCH_APPOINTMENTS_START event', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchAppointmentsStart.type })
    })

    it('should call the AppointmentRepository findAll() function', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(findAllSpy).toHaveBeenCalled()
    })

    it('should dispatch the FETCH_APPOINTMENTS_SUCCESS event', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointments()(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: fetchAppointmentsSuccess.type,
        payload: expectedAppointments,
      })
    })
  })
})
