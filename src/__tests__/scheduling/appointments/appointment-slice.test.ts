import { AnyAction } from 'redux'
import Appointment from 'model/Appointment'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { mocked } from 'ts-jest/utils'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import appointment, {
  fetchAppointmentStart,
  fetchAppointmentSuccess,
  fetchAppointment,
} from '../../../scheduling/appointments/appointment-slice'

describe('appointment slice', () => {
  describe('appointment reducer', () => {
    it('should create an initial state properly', () => {
      const appointmentStore = appointment(undefined, {} as AnyAction)

      expect(appointmentStore.appointment).toEqual({} as Appointment)
      expect(appointmentStore.isLoading).toBeFalsy()
    })
    it('should handle the FETCH_APPOINTMENT_START action', () => {
      const appointmentStore = appointment(undefined, {
        type: fetchAppointmentStart.type,
      })

      expect(appointmentStore.isLoading).toBeTruthy()
    })
    it('should handle the FETCH_APPOINTMENT_SUCCESS action', () => {
      const expectedAppointment = {
        patientId: '1234',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
      }

      const expectedPatient = {
        id: '123',
        fullName: 'full name',
      }

      const appointmentStore = appointment(undefined, {
        type: fetchAppointmentSuccess.type,
        payload: { appointment: expectedAppointment, patient: expectedPatient },
      })

      expect(appointmentStore.isLoading).toBeFalsy()
      expect(appointmentStore.appointment).toEqual(expectedAppointment)
      expect(appointmentStore.patient).toEqual(expectedPatient)
    })
  })

  describe('fetchAppointment()', () => {
    let findSpy = jest.spyOn(AppointmentRepository, 'find')
    let findPatientSpy = jest.spyOn(PatientRepository, 'find')
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

    const expectedPatient: Patient = {
      id: '123',
      fullName: 'expected full name',
    } as Patient

    beforeEach(() => {
      jest.resetAllMocks()
      findSpy = jest.spyOn(AppointmentRepository, 'find')
      mocked(AppointmentRepository, true).find.mockResolvedValue(expectedAppointment)
      findPatientSpy = jest.spyOn(PatientRepository, 'find')
      mocked(PatientRepository, true).find.mockResolvedValue(expectedPatient)
    })

    it('should dispatch the FETCH_APPOINTMENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointment('id')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchAppointmentStart.type })
    })

    it('should call appointment repository find', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedId = '1234'
      await fetchAppointment(expectedId)(dispatch, getState, null)

      expect(findSpy).toHaveBeenCalledTimes(1)
      expect(findSpy).toHaveBeenCalledWith(expectedId)
    })

    it('should call patient repository find', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedId = '123'
      await fetchAppointment(expectedId)(dispatch, getState, null)

      expect(findPatientSpy).toHaveBeenCalledTimes(1)
      expect(findPatientSpy).toHaveBeenCalledWith(expectedId)
    })

    it('should dispatch the FETCH_APPOINTMENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      await fetchAppointment('id')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: fetchAppointmentSuccess.type,
        payload: { appointment: expectedAppointment, patient: expectedPatient },
      })
    })
  })
})
