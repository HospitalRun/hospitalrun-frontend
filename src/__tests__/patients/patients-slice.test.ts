import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import { UnpagedRequest } from 'clients/db/PageRequest'
import Page from 'clients/Page'
import Patient from 'model/Patient'
import patients, {
  fetchPatientsStart,
  fetchPatientsSuccess,
  searchPatients,
} from '../../patients/patients-slice'
import PatientRepository from '../../clients/db/PatientRepository'

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patients reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientsStore = patients(undefined, {} as AnyAction)
      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients.content).toHaveLength(0)
    })

    it('should handle the FETCH_PATIENTS_SUCCESS action', () => {
      const expectedPatients = {
        content: [
          {
            id: '123',
            fullName: 'test test',
            isApproximateDateOfBirth: false,
            givenName: 'test',
            familyName: 'test',
            code: 'P12345',
            sex: 'male',
            dateOfBirth: new Date().toISOString(),
            phoneNumber: '99999999',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rev: '',
          },
        ],
        hasNext: false,
        hasPrevious: false,
        pageRequest: UnpagedRequest,
      }
      const patientsStore = patients(undefined, {
        type: fetchPatientsSuccess.type,
        payload: expectedPatients,
      })

      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients).toEqual(expectedPatients)
    })
  })

  describe('searchPatients', () => {
    beforeEach(() => {
      const mockedPatientRepository = mocked(PatientRepository, true)
      jest.spyOn(PatientRepository, 'findAllPaged')
      jest.spyOn(PatientRepository, 'searchPaged')

      mockedPatientRepository.findAllPaged.mockResolvedValue(
        new Promise<Page<Patient>>((resolve) => {
          const pagedResult: Page<Patient> = {
            content: [],
            hasPrevious: false,
            hasNext: false,
          }
          resolve(pagedResult)
        }),
      )

      mockedPatientRepository.searchPaged.mockResolvedValue(
        new Promise<Page<Patient>>((resolve) => {
          const pagedResult: Page<Patient> = {
            content: [],
            hasPrevious: false,
            hasNext: false,
          }
          resolve(pagedResult)
        }),
      )
    })

    it('should dispatch the FETCH_PATIENTS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchPatientsStart.type })
    })

    it('should call the PatientRepository searchPaged method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'searchPaged')

      const expectedSearchString = 'search string'
      await searchPatients(expectedSearchString)(dispatch, getState, null)

      expect(PatientRepository.searchPaged).toHaveBeenCalledWith(
        expectedSearchString,
        UnpagedRequest,
      )
    })

    it('should call the PatientRepository findAllPaged method if there is no string text', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'findAllPaged')

      await searchPatients('')(dispatch, getState, null)

      expect(PatientRepository.findAllPaged).toHaveBeenCalledTimes(1)
    })

    it('should dispatch the FETCH_PATIENTS_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchPatientsSuccess.type,
        payload: {
          content: [],
          hasPrevious: false,
          hasNext: false,
        },
      })
    })
  })
})
