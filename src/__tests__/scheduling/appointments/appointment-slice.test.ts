import { AnyAction } from 'redux'
import Appointment from 'model/Appointment'
import AppointmentRepository from 'clients/db/AppointmentRepository'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import appointment, {
  fetchAppointmentStart,
  fetchAppointmentSuccess,
  fetchAppointment,
  createAppointmentStart,
  createAppointmentSuccess,
  createAppointment,
  updateAppointmentStart,
  updateAppointmentSuccess,
  updateAppointment,
} from '../../../scheduling/appointments/appointment-slice'

describe('appointment slice', () => {
  describe('appointment reducer', () => {
    it('should create an initial state properly', () => {
      const appointmentStore = appointment(undefined, {} as AnyAction)

      expect(appointmentStore.appointment).toEqual({} as Appointment)
      expect(appointmentStore.isLoading).toBeFalsy()
    })
    it('should handle the CREATE_APPOINTMENT_START action', () => {
      const appointmentStore = appointment(undefined, {
        type: createAppointmentStart.type,
      })

      expect(appointmentStore.isLoading).toBeTruthy()
    })

    it('should handle the CREATE_APPOINTMENT_SUCCESS action', () => {
      const appointmentStore = appointment(undefined, {
        type: createAppointmentSuccess.type,
      })

      expect(appointmentStore.isLoading).toBeFalsy()
    })

    it('should handle the UPDATE_APPOINTMENT_START action', () => {
      const appointmentStore = appointment(undefined, {
        type: updateAppointmentStart.type,
      })

      expect(appointmentStore.isLoading).toBeTruthy()
    })

    it('should handle the UPDATE_APPOINTMENT_SUCCESS action', () => {
      const expectedAppointment = {
        patientId: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        location: 'location',
        type: 'type',
        reason: 'reason',
      } as Appointment
      const appointmentStore = appointment(undefined, {
        type: updateAppointmentSuccess.type,
        payload: {
          ...expectedAppointment,
        },
      })

      expect(appointmentStore.isLoading).toBeFalsy()
      expect(appointmentStore.appointment).toEqual(expectedAppointment)
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

  describe('createAppointment()', () => {
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

  describe('update appointment', () => {
    it('should dispatch the UPDATE_APPOINTMENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(AppointmentRepository, 'saveOrUpdate')
      const expectedAppointmentId = 'sliceId9'
      const expectedAppointment = { id: expectedAppointmentId } as Appointment
      const mockedAppointmentRepository = mocked(AppointmentRepository, true)
      mockedAppointmentRepository.saveOrUpdate.mockResolvedValue(expectedAppointment)

      await updateAppointment(expectedAppointment, createMemoryHistory())(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: updateAppointmentStart.type })
    })

    it('should call the AppointmentRepository saveOrUpdate function with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(AppointmentRepository, 'saveOrUpdate')
      const expectedAppointmentId = 'sliceId10'
      const expectedAppointment = { id: expectedAppointmentId } as Appointment
      const mockedAppointmentRepository = mocked(AppointmentRepository, true)
      mockedAppointmentRepository.saveOrUpdate.mockResolvedValue(expectedAppointment)

      await updateAppointment(expectedAppointment, createMemoryHistory())(dispatch, getState, null)

      expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledWith(expectedAppointment)
    })

    it('should dispatch the UPDATE_APPOINTMENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(AppointmentRepository, 'saveOrUpdate')
      const expectedAppointmentId = 'sliceId11'
      const expectedAppointment = { id: expectedAppointmentId } as Appointment
      const mockedAppointmentRepository = mocked(AppointmentRepository, true)
      mockedAppointmentRepository.saveOrUpdate.mockResolvedValue(expectedAppointment)

      await updateAppointment(expectedAppointment, createMemoryHistory())(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: updateAppointmentSuccess.type,
        payload: expectedAppointment,
      })
    })
  })
})
