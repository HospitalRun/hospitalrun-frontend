import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as uuid from '../../util/uuid'
import patient, {
  fetchPatientStart,
  fetchPatientSuccess,
  fetchPatient,
  createPatientStart,
  createPatientSuccess,
  createPatient,
  updatePatientStart,
  updatePatientSuccess,
  updatePatient,
  addRelatedPerson,
  addDiagnosis,
  addAllergy,
  removeRelatedPerson,
} from '../../patients/patient-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'
import { RootState } from '../../store'
import RelatedPerson from '../../model/RelatedPerson'
import Diagnosis from '../../model/Diagnosis'
import Allergy from '../../model/Allergy'

const mockStore = createMockStore<RootState, any>([thunk])

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patient reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientStore = patient(undefined, {} as AnyAction)
      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual({})
    })

    it('should handle the FETCH_PATIENT_START action', () => {
      const patientStore = patient(undefined, {
        type: fetchPatientStart.type,
      })

      expect(patientStore.isLoading).toBeTruthy()
    })

    it('should handle the FETCH_PATIENT_SUCCESS actions', () => {
      const expectedPatient = {
        id: '123',
        rev: '123',
        sex: 'male',
        dateOfBirth: new Date().toISOString(),
        givenName: 'test',
        familyName: 'test',
      }
      const patientStore = patient(undefined, {
        type: fetchPatientSuccess.type,
        payload: {
          ...expectedPatient,
        },
      })

      expect(patientStore.isLoading).toBeFalsy()
      expect(patientStore.patient).toEqual(expectedPatient)
    })

    it('should handle the CREATE_PATIENT_START action', () => {
      const patientsStore = patient(undefined, {
        type: createPatientStart.type,
      })

      expect(patientsStore.isLoading).toBeTruthy()
    })

    it('should handle the CREATE_PATIENT_SUCCESS actions', () => {
      const patientsStore = patient(undefined, {
        type: createPatientSuccess.type,
      })

      expect(patientsStore.isLoading).toBeFalsy()
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

  describe('createPatient()', () => {
    it('should dispatch the CREATE_PATIENT_START action', async () => {
      jest.spyOn(PatientRepository, 'save')
      mocked(PatientRepository).save.mockResolvedValue({ id: 'sliceId1' } as Patient)
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {
        id: 'sliceId1',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientStart.type })
    })

    it('should call the PatientRepository save method with the correct patient', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'save')
      mocked(PatientRepository).save.mockResolvedValue({ id: 'sliceId2' } as Patient)
      const expectedPatient = {
        id: 'sliceId2',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(PatientRepository.save).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the CREATE_PATIENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: 'slideId3' } as Patient)
      const expectedPatient = {
        id: 'slideId3',
      } as Patient

      await createPatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientSuccess.type })
    })

    it('should call the on success function', async () => {
      const onSuccessSpy = jest.fn()
      const expectedPatientId = 'sliceId5'
      const expectedFullName = 'John Doe II'
      const expectedPatient = {
        id: expectedPatientId,
        fullName: expectedFullName,
      } as Patient
      jest.spyOn(PatientRepository, 'save')
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue(expectedPatient)
      const dispatch = jest.fn()
      const getState = jest.fn()

      await createPatient(expectedPatient, onSuccessSpy)(dispatch, getState, null)

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })
  })

  describe('fetchPatient()', () => {
    it('should dispatch the FETCH_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId6'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchPatientStart.type })
    })

    it('should call the PatientRepository find method with the correct patient id', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId7'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)
      jest.spyOn(PatientRepository, 'find')

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    })

    it('should dispatch the FETCH_PATIENT_SUCCESS action with the correct data', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'find')
      const expectedPatientId = 'sliceId8'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.find.mockResolvedValue(expectedPatient)

      await fetchPatient(expectedPatientId)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: fetchPatientSuccess.type,
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
      const expectedPatientId = 'sliceId9'
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
      const expectedPatientId = 'sliceId10'
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
      const expectedPatientId = 'sliceId11'
      const expectedPatient = { id: expectedPatientId } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      await updatePatient(expectedPatient)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({
        type: updatePatientSuccess.type,
        payload: expectedPatient,
      })
    })

    it('should call the onSuccess function', async () => {
      const onSuccessSpy = jest.fn()
      const expectedPatientId = 'sliceId11'
      const fullName = 'John Doe II'
      const expectedPatient = {
        id: expectedPatientId,
        fullName,
      } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)
      const dispatch = jest.fn()
      const getState = jest.fn()

      await updatePatient(expectedPatient, onSuccessSpy)(dispatch, getState, null)

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedPatient)
    })
  })

  describe('add related person', () => {
    it('should add the related person to the patient with the given id', async () => {
      const expectedRelatedPersonId = 'expected id'
      const store = mockStore()
      const expectedPatientId = '123'

      const expectedPatient = {
        id: expectedPatientId,
      } as Patient

      const expectedRelatedPerson = {
        patientId: '456',
        type: '1234',
      } as RelatedPerson

      const expectedUpdatedPatient = {
        ...expectedPatient,
        relatedPersons: [{ ...expectedRelatedPerson, id: expectedRelatedPersonId }],
      } as Patient

      const findPatientSpy = jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValue(expectedPatient)
      jest.spyOn(uuid, 'uuid').mockReturnValue(expectedRelatedPersonId)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedUpdatedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(addRelatedPerson(expectedPatientId, expectedRelatedPerson, onSuccessSpy))

      expect(findPatientSpy).toHaveBeenCalledWith(expectedPatientId)
      expect(store.getActions()[1]).toEqual(updatePatientSuccess(expectedUpdatedPatient))
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedUpdatedPatient)
    })
  })

  describe('remove related person', () => {
    it('should remove the related related person rom patient with the given id', async () => {
      const store = mockStore()

      const expectedRelatedPersonPatientId = 'expected id'
      const expectedPatientId = '123'

      const expectedRelatedPerson = {
        id: 'some id',
        patientId: expectedRelatedPersonPatientId,
        type: 'some type',
      } as RelatedPerson

      const expectedPatient = {
        id: expectedPatientId,
        relatedPersons: [expectedRelatedPerson],
      } as Patient

      const expectedUpdatedPatient = {
        ...expectedPatient,
        relatedPersons: [],
      } as Patient

      const findPatientSpy = jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValue(expectedPatient)
      jest.spyOn(uuid, 'uuid').mockReturnValue(expectedRelatedPersonPatientId)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedUpdatedPatient)

      await store.dispatch(removeRelatedPerson(expectedPatientId, expectedRelatedPersonPatientId))

      expect(findPatientSpy).toHaveBeenCalledWith(expectedPatientId)
      expect(store.getActions()[1]).toEqual(updatePatientSuccess(expectedUpdatedPatient))
    })
  })

  describe('add diagnosis', () => {
    it('should add the diagnosis to the patient with the given id', async () => {
      const expectedDiagnosisId = 'expected id'
      const store = mockStore()
      const expectedPatientId = '123'

      const expectedPatient = {
        id: expectedPatientId,
      } as Patient

      const expectedDiagnosis = {
        diagnosisDate: new Date().toISOString(),
        name: 'diagnosis name',
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
  })

  describe('add allergy', () => {
    it('should add the allergy to the patient with the given id', async () => {
      const expectedAllergyId = 'expected id'
      const store = mockStore()
      const expectedPatientId = '123'

      const expectedPatient = {
        id: expectedPatientId,
      } as Patient

      const expectedAllergy = {
        name: 'allergy name',
      } as Allergy

      const expectedUpdatedPatient = {
        ...expectedPatient,
        allergies: [{ ...expectedAllergy, id: expectedAllergyId }],
      } as Patient

      const findPatientSpy = jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValue(expectedPatient)
      jest.spyOn(uuid, 'uuid').mockReturnValue(expectedAllergyId)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedUpdatedPatient)
      const onSuccessSpy = jest.fn()

      await store.dispatch(addAllergy(expectedPatientId, expectedAllergy, onSuccessSpy))

      expect(findPatientSpy).toHaveBeenCalledWith(expectedPatientId)
      expect(store.getActions()[1]).toEqual(updatePatientSuccess(expectedUpdatedPatient))
      expect(onSuccessSpy).toHaveBeenCalledWith(expectedUpdatedPatient)
    })
  })
})
