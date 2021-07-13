import addDays from 'date-fns/addDays'
import { AnyAction } from 'redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import patient, {
  addDiagnosis,
  addDiagnosisError,
  createPatient,
  createPatientError,
  createPatientStart,
  createPatientSuccess,
  updatePatient,
  updatePatientError,
  updatePatientStart,
  updatePatientSuccess,
} from '../../patients/patient-slice'
import PatientRepository from '../../shared/db/PatientRepository'
import Diagnosis, { DiagnosisStatus } from '../../shared/model/Diagnosis'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import * as uuid from '../../shared/util/uuid'

const mockStore = createMockStore<RootState, any>([thunk])

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patient reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientStore = patient(undefined, {} as AnyAction)
      expect(patientStore.status).toEqual('loading')
      expect(patientStore.patient).toEqual({})
    })

    it('should handle the CREATE_PATIENT_START action', () => {
      const patientsStore = patient(undefined, {
        type: createPatientStart.type,
      })

      expect(patientsStore.status).toEqual('loading')
    })

    it('should handle the CREATE_PATIENT_SUCCESS actions', () => {
      const patientsStore = patient(undefined, {
        type: createPatientSuccess.type,
      })

      expect(patientsStore.status).toEqual('completed')
    })

    it('should handle the UPDATE_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: updatePatientStart.type,
      })

      expect(patientStore.status).toEqual('loading')
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

      expect(patientStore.status).toEqual('completed')
      expect(patientStore.patient).toEqual(expectedPatient)
    })

    it('should handle the create patient error action', () => {
      const expectedError = {
        message: 'some message',
        giveName: 'some given name feedback',
        dateOfBirth: 'some date of birth feedback',
      }
      const patientStore = patient(undefined, createPatientError(expectedError))

      expect(patientStore.status).toEqual('error')
      expect(patientStore.createError).toEqual(expectedError)
    })

    it('should handle the update patient error action', () => {
      const expectedError = {
        message: 'some message',
        giveName: 'some given name feedback',
        dateOfBirth: 'some date of birth feedback',
      }
      const patientStore = patient(undefined, updatePatientError(expectedError))

      expect(patientStore.status).toEqual('error')
      expect(patientStore.updateError).toEqual(expectedError)
    })
  })

  describe('create patient', () => {
    it('should dispatch the CREATE_PATIENT_START action', async () => {
      const store = mockStore()
      jest.spyOn(PatientRepository, 'save').mockResolvedValue({ id: 'sliceId1' } as Patient)
      const expectedPatient = {
        id: 'sliceId1',
        givenName: 'some name',
      } as Patient

      await store.dispatch(createPatient(expectedPatient))

      expect(store.getActions()[0]).toEqual(createPatientStart())
    })

    it('should call the PatientRepository save method with the correct patient', async () => {
      const store = mockStore()
      jest.spyOn(PatientRepository, 'save').mockResolvedValue({ id: 'sliceId1' } as Patient)

      const expectedPatient = {
        id: 'sliceId1',
        givenName: 'some name',
        fullName: 'some name',
      } as Patient

      expectedPatient.visits = []

      await store.dispatch(createPatient(expectedPatient))

      expect(PatientRepository.save).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the CREATE_PATIENT_SUCCESS action', async () => {
      const store = mockStore()
      jest.spyOn(PatientRepository, 'save').mockResolvedValue({ id: 'sliceId1' } as Patient)
      const expectedPatient = {
        id: 'sliceId1',
        givenName: 'some name',
      } as Patient

      await store.dispatch(createPatient(expectedPatient))

      expect(store.getActions()[1]).toEqual(createPatientSuccess())
    })

    it('should call the on success function', async () => {
      const store = mockStore()
      const expectedPatient = {
        id: 'sliceId1',
        givenName: 'some name',
      } as Patient
      jest.spyOn(PatientRepository, 'save').mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })

    it('should validate the patient required fields', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: undefined,
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        createPatientError({
          message: 'patient.errors.createPatientError',
          givenName: 'patient.errors.patientGivenNameFeedback',
        }),
      )
    })

    it('should validate that the patient birthday is not a future date', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some given name',
        dateOfBirth: addDays(new Date(), 4).toISOString(),
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        createPatientError({
          message: 'patient.errors.createPatientError',
          dateOfBirth: 'patient.errors.patientDateOfBirthFeedback',
        }),
      )
    })

    it('should validate that the patient phone number is a valid phone number', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some given name',
        phoneNumbers: [{ value: 'not a phone number' }],
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        createPatientError({
          message: 'patient.errors.createPatientError',
          phoneNumbers: ['patient.errors.invalidPhoneNumber'],
        }),
      )
    })

    it('should validate that the patient email is a valid email', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some given name',
        emails: [{ value: 'not an email' }],
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        createPatientError({
          message: 'patient.errors.createPatientError',
          emails: ['patient.errors.invalidEmail'],
        }),
      )
    })

    it('should validate fields that should only contian alpha characters', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some given name',
        suffix: 'A123',
        familyName: 'B456',
        prefix: 'C987',
        preferredLanguage: 'D321',
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(createPatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        createPatientError({
          message: 'patient.errors.createPatientError',
          suffix: 'patient.errors.patientNumInSuffixFeedback',
          familyName: 'patient.errors.patientNumInFamilyNameFeedback',
          prefix: 'patient.errors.patientNumInPrefixFeedback',
          preferredLanguage: 'patient.errors.patientNumInPreferredLanguageFeedback',
        }),
      )
    })
  })
  describe('update patient', () => {
    it('should dispatch the UPDATE_PATIENT_START action', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId9'
      const expectedPatient = { id: expectedPatientId, givenName: 'some name' } as Patient
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)

      await store.dispatch(updatePatient(expectedPatient))

      expect(store.getActions()[0]).toEqual(updatePatientStart())
    })

    it('should call the PatientRepository saveOrUpdate function with the correct data', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId9'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some name',
        fullName: 'some name',
        visits: [] as Visit[],
      } as Patient

      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)

      await store.dispatch(updatePatient(expectedPatient))

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the UPDATE_PATIENT_SUCCESS action with the correct data', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId11'
      const expectedPatient = { id: expectedPatientId, givenName: 'some name' } as Patient
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)

      await store.dispatch(updatePatient(expectedPatient))

      expect(store.getActions()[1]).toEqual(updatePatientSuccess(expectedPatient))
    })

    it('should call the onSuccess function', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = { id: expectedPatientId, givenName: 'some name' } as Patient
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(updatePatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })

    it('should validate the patient', async () => {
      const store = mockStore()
      const expectedPatientId = 'sliceId10'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: undefined,
        dateOfBirth: addDays(new Date(), 4).toISOString(),
        suffix: '061002',
        prefix: '061002',
        familyName: '061002',
        preferredLanguage: '061002',
      } as Patient
      const saveOrUpdateSpy = jest
        .spyOn(PatientRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(updatePatient(expectedPatient, onSuccessSpy))

      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(saveOrUpdateSpy).not.toHaveBeenCalled()
      expect(store.getActions()[1]).toEqual(
        updatePatientError({
          message: 'patient.errors.updatePatientError',
          givenName: 'patient.errors.patientGivenNameFeedback',
          dateOfBirth: 'patient.errors.patientDateOfBirthFeedback',
          suffix: 'patient.errors.patientNumInSuffixFeedback',
          familyName: 'patient.errors.patientNumInFamilyNameFeedback',
          prefix: 'patient.errors.patientNumInPrefixFeedback',
          preferredLanguage: 'patient.errors.patientNumInPreferredLanguageFeedback',
        }),
      )
    })
  })

  describe('add diagnosis', () => {
    it('should add the diagnosis to the patient with the given id', async () => {
      const expectedDiagnosisId = 'expected id'
      const store = mockStore()
      const expectedPatientId = '123'

      const expectedPatient = {
        id: expectedPatientId,
        givenName: 'some name',
      } as Patient

      const expectedDiagnosis = {
        diagnosisDate: new Date().toISOString(),
        name: 'diagnosis name',
        onsetDate: new Date().toISOString(),
        abatementDate: new Date().toISOString(),
        status: DiagnosisStatus.Active,
      } as Diagnosis

      const expectedUpdatedPatient = {
        ...expectedPatient,
        diagnoses: [{ ...expectedDiagnosis, id: expectedDiagnosisId }],
      } as Patient

      const findPatientSpy = jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValue(expectedPatient)
      jest.spyOn(uuid, 'uuid').mockReturnValue(expectedDiagnosisId)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedUpdatedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(addDiagnosis(expectedPatientId, expectedDiagnosis, onSuccessSpy))

      expect(findPatientSpy).toHaveBeenCalledWith(expectedPatientId)
      expect(store.getActions()[1]).toEqual(updatePatientSuccess(expectedUpdatedPatient))
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedUpdatedPatient)
    })

    it('should validate the diagnosis', async () => {
      const expectedError = {
        message: 'patient.diagnoses.error.unableToAdd',
        name: 'patient.diagnoses.error.nameRequired',
        date: 'patient.diagnoses.error.dateRequired',
        status: 'patient.diagnoses.error.statusRequired',
      }
      const store = mockStore()
      const expectedDiagnosis = {} as Diagnosis
      const onSuccessSpy = jest.fn()

      await store.dispatch(addDiagnosis('some id', expectedDiagnosis, onSuccessSpy))

      expect(store.getActions()[0]).toEqual(addDiagnosisError(expectedError))
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })
  })
})
