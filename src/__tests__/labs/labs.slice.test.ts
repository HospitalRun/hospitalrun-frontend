import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'

import LabRepository from '../../clients/db/LabRepository'
import SortRequest from '../../clients/db/SortRequest'
import labs, { fetchLabsStart, fetchLabsSuccess, searchLabs } from '../../labs/labs-slice'
import Lab from '../../model/Lab'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
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

describe('labs slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('labs reducer', () => {
    it('should create the proper intial state with empty labs array', () => {
      const labsStore = labs(undefined, {} as AnyAction)
      expect(labsStore.isLoading).toBeFalsy()
      expect(labsStore.labs).toHaveLength(0)
      expect(labsStore.statusFilter).toEqual('all')
    })

    it('it should handle the FETCH_LABS_SUCCESS action', () => {
      const expectedLabs = [{ id: '1234' }]
      const labsStore = labs(undefined, {
        type: fetchLabsSuccess.type,
        payload: expectedLabs,
      })

      expect(labsStore.isLoading).toBeFalsy()
      expect(labsStore.labs).toEqual(expectedLabs)
    })
  })

  describe('searchLabs', () => {
    it('should dispatch the FETCH_LABS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchLabs('search string', 'all')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchLabsStart.type })
    })

    it('should call the LabRepository search method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'search')

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(LabRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })

    it('should call the LabRepository findAll method if there is no string text and status is set to all', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'findAll')

      await searchLabs('', expectedSearchObject.status)(dispatch, getState, null)

      expect(LabRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should dispatch the FETCH_LABS_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      const expectedLabs = [
        {
          type: 'text',
        },
      ] as Lab[]

      const mockedLabRepository = mocked(LabRepository, true)
      mockedLabRepository.search.mockResolvedValue(expectedLabs)

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchLabsSuccess.type,
        payload: expectedLabs,
      })
    })
  })

  describe('sort Request', () => {
    it('should have called findAll with sort request in searchLabs method', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'findAll')

      await searchLabs('', expectedSearchObject.status)(dispatch, getState, null)

      expect(LabRepository.findAll).toHaveBeenCalledWith(expectedSearchObject.defaultSortRequest)
    })

    it('should include sorts in the search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'search')

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(LabRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })
  })
})
