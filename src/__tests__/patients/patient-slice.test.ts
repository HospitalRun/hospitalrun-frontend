import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import patient, {
  getPatientStart,
  getPatientSuccess,
  fetchPatient,
  updatePatientStart,
  updatePatientSuccess,
  updatePatient,
} from '../../patients/patient-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patients reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientStore = patient(undefined, {} as AnyAction)
      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual({})
    })

    it('should handle the GET_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: getPatientStart.type,
      })

      expect(patientStore.isLoading).toBeTruthy()
    })

    it('should handle the GET_PATIENT_SUCCESS actions', () => {
      const expectedPatient = {
        id: '123',
        rev: '123',
        sex: 'male',
        dateOfBirth: new Date().toISOString(),
        givenName: 'test',
        familyName: 'test',
      }
      const patientStore = patient(undefined, {
        type: getPatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })

      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual(expectedPatient)
    })

    it('should handle the UPDATE_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: updatePatientStart.type,
      })

      expect(patientStore.isLoading).toBeTruthy()
    })

    it('should handle the UPDATE_PATIENT_SUCCESS action', () => {
      const expectedPatient = {
        id: '123',
        rev: '123',
        sex: 'male',
        dateOfBirth: new Date().toISOString(),
        givenName: 'test',
        familyName: 'test',
      }
      const patientStore = patient(undefined, {
        type: updatePatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })

      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual(expectedPatient)
    })
  })

  describe('fetchPatient()', () => {
    it('should dispatch the GET_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: getPatientStart.type })
    })

    it('should call the PatientRepository find method with the correct patient id', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)
      jest.spyOn(PatientRepository, 'find')

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    })

    it('should dispatch the GET_PATIENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: getPatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })
    })
  })

  describe('update patient', () => {
    it('should dispatch the UPDATE_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: updatePatientStart.type })
    })

    it('should call the PatientRepository saveOrUpdate function with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the UPDATE_PATIENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedPatientId = '12345'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: updatePatientSuccess.type,
        payload: expectedPatient,
      })
    })
  })
})
