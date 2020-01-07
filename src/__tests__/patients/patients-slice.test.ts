import { AnyAction } from 'redux'
import { createMemoryHistory } from 'history'
import { mocked } from 'ts-jest/utils'
import patients, {
  getPatientsStart,
  getAllPatientsSuccess,
  createPatientStart,
  createPatientSuccess,
  createPatient,
  searchPatients,
} from '../../patients/patients-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'
import Search from '../../clients/db/Search'

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patients reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientsStore = patients(undefined, {} as AnyAction)
      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients).toHaveLength(0)
    })

    it('should handle the CREATE_PATIENT_START action', () => {
      const patientsStore = patients(undefined, {
        type: createPatientStart.type,
      })

      expect(patientsStore.isLoading).toBeTruthy()
    })

    it('should handle the CREATE_PATIENT_SUCCESS actions', () => {
      const patientsStore = patients(undefined, {
        type: createPatientSuccess.type,
      })

      expect(patientsStore.isLoading).toBeFalsy()
    })
  })

  describe('createPatient()', () => {
    it('should dispatch the CREATE_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {
        id: 'id',
      } as Patient

      await createPatient(expectedPatient, createMemoryHistory())(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientStart.type })
    })

    it('should call the PatientRepository save method with the correct patient', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'save')
      const expectedPatient = {
        id: 'id',
      } as Patient

      await createPatient(expectedPatient, createMemoryHistory())(dispatch, getState, null)

      expect(PatientRepository.save).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the CREATE_PATIENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: '12345' } as Patient)
      const expectedPatient = {
        id: 'id',
      } as Patient

      await createPatient(expectedPatient, createMemoryHistory())(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: createPatientSuccess.type })
    })

    it('should navigate to the /patients/:id where id is the new patient id', async () => {
      const expectedPatientId = '12345'
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: expectedPatientId } as Patient)
      const history = createMemoryHistory()

      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {} as Patient

      await createPatient(expectedPatient, history)(dispatch, getState, null)

      expect(history.entries[1].pathname).toEqual(`/patients/${expectedPatientId}`)
    })
  })

  describe('searchPatients', () => {
    it('should dispatch the GET_PATIENTS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: getPatientsStart.type })
    })

    it('should call the PatientRepository search method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'search')

      const expectedSearchString = 'search string'
      const expectedSearchFields = ['fullName']
      await searchPatients(expectedSearchString)(dispatch, getState, null)

      expect(PatientRepository.search).toHaveBeenCalledWith(
        new Search(expectedSearchString, expectedSearchFields),
      )
    })

    it('should dispatch the GET_ALL_PATIENTS_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      const expectedPatients = [
        {
          id: '1234',
        },
      ] as Patient[]

      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.search.mockResolvedValue(expectedPatients)

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenLastCalledWith({
        type: getAllPatientsSuccess.type,
        payload: expectedPatients,
      })
    })
  })
})
