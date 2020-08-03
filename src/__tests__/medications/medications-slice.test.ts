import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'

import medications, {
  fetchMedicationsStart,
  fetchMedicationsSuccess,
  searchMedications,
} from '../../medications/medications-slice'
import MedicationRepository from '../../shared/db/MedicationRepository'
import SortRequest from '../../shared/db/SortRequest'
import Medication from '../../shared/model/Medication'

interface SearchContainer {
  text: string
  status: 'draft' | 'active' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const expectedSearchObject: SearchContainer = {
  text: 'search string',
  status: 'all',
  defaultSortRequest,
}

describe('medications slice', () => {
  const setup = (medicationSpyOn: string) => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    jest.spyOn(MedicationRepository, medicationSpyOn as any)
    return [dispatch, getState]
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('medications reducer', () => {
    it('should create the proper initial state with empty medications array', () => {
      const medicationsStore = medications(undefined, {} as AnyAction)
      expect(medicationsStore.isLoading).toBeFalsy()
      expect(medicationsStore.medications).toHaveLength(0)
      expect(medicationsStore.statusFilter).toEqual('all')
    })

    it('it should handle the FETCH_MEDICATIONS_SUCCESS action', () => {
      const expectedMedications = [{ id: '1234' }]
      const medicationsStore = medications(undefined, {
        type: fetchMedicationsSuccess.type,
        payload: expectedMedications,
      })

      expect(medicationsStore.isLoading).toBeFalsy()
      expect(medicationsStore.medications).toEqual(expectedMedications)
    })
  })

  describe('searchMedications', () => {
    it('should dispatch the FETCH_MEDICATIONS_START action', async () => {
      const [dispatch, getState] = setup('search')

      await searchMedications('search string', 'all')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchMedicationsStart.type })
    })

    it('should call the MedicationRepository search method with the correct search criteria', async () => {
      const [dispatch, getState] = setup('search')
      jest.spyOn(MedicationRepository, 'search')

      await searchMedications(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(MedicationRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })

    it('should call the MedicationRepository findAll method if there is no string text and status is set to all', async () => {
      const [dispatch, getState] = setup('findAll')

      await searchMedications('', expectedSearchObject.status)(dispatch, getState, null)

      expect(MedicationRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should dispatch the FETCH_MEDICATIONS_SUCCESS action', async () => {
      const [dispatch, getState] = setup('findAll')

      const expectedMedications = [
        {
          medication: 'text',
        },
      ] as Medication[]

      const mockedMedicationRepository = mocked(MedicationRepository, true)
      mockedMedicationRepository.search.mockResolvedValue(expectedMedications)

      await searchMedications(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchMedicationsSuccess.type,
        payload: expectedMedications,
      })
    })
  })

  describe('sort Request', () => {
    it('should have called findAll with sort request in searchMedications method', async () => {
      const [dispatch, getState] = setup('findAll')

      await searchMedications('', expectedSearchObject.status)(dispatch, getState, null)

      expect(MedicationRepository.findAll).toHaveBeenCalledWith(
        expectedSearchObject.defaultSortRequest,
      )
    })

    it('should include sorts in the search criteria', async () => {
      const [dispatch, getState] = setup('search')

      await searchMedications(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(MedicationRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })
  })
})
