import '../../__mocks__/matchMediaMock'

import { AnyAction } from 'redux'

import PatientRepository from '../../clients/db/PatientRepository'
import Patient from '../../model/Patient'
import patients, {
  fetchPatientsStart,
  fetchPatientsSuccess,
  searchPatients,
} from '../../patients/patients-slice'

describe('patients slice', () => {
  const expectedPatients = [
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
    } as Patient,
  ]

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patients reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientsStore = patients(undefined, {} as AnyAction)
      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients).toHaveLength(0)
    })

    it('should handle the FETCH_PATIENTS_SUCCESS action', () => {
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
      jest.spyOn(PatientRepository, 'findAll').mockResolvedValue(expectedPatients)
      jest.spyOn(PatientRepository, 'search').mockResolvedValue(expectedPatients)
    })

    it('should dispatch the FETCH_PATIENTS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchPatientsStart.type })
    })

    it('should call the PatientRepository search method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'search')

      const expectedSearchString = 'search string'
      await searchPatients(expectedSearchString)(dispatch, getState, null)

      expect(PatientRepository.search).toHaveBeenCalledWith(expectedSearchString)
    })

    it('should call the PatientRepository findAll method if there is no string text', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'findAll')

      await searchPatients('')(dispatch, getState, null)

      expect(PatientRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should dispatch the FETCH_PATIENTS_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchPatientsSuccess.type,
        payload: expectedPatients,
      })
    })
  })
})
