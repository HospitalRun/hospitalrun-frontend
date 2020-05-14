import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'
import patients, {
  fetchPatientsStart,
  fetchPatientsSuccess,
  searchPatients,
} from '../../patients/patients-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'

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

    it('should handle the FETCH_PATIENTS_SUCCESS action', () => {
      const expectedPatients = [{ id: '1234' }]
      const patientsStore = patients(undefined, {
        type: fetchPatientsSuccess.type,
        payload: [{ id: '1234' }],
      })

      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients).toEqual(expectedPatients)
    })
  })

  describe('searchPatients', () => {
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

      const expectedPatients = [
        {
          id: '1234',
        },
      ] as Patient[]

      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.search.mockResolvedValue(expectedPatients)

      await searchPatients('search string')(dispatch, getState, null)

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchPatientsSuccess.type,
        payload: expectedPatients,
      })
    })
  })
})
