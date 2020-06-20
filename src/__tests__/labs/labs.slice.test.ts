import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'

import LabRepository from '../../clients/db/LabRepository'
import { UnpagedRequest } from '../../clients/db/PageRequest'
import SortRequest from '../../clients/db/SortRequest'
import Page from '../../clients/Page'
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
      expect(labsStore.labs.content).toHaveLength(0)
      expect(labsStore.labs.hasPrevious).toBeFalsy()
      expect(labsStore.labs.hasNext).toBeFalsy()
      expect(labsStore.labs.pageRequest).toBeUndefined()
      expect(labsStore.statusFilter).toEqual('all')
    })

    it('it should handle the FETCH_LABS_SUCCESS action', () => {
      const expectedLabs = [{ id: '1234' }]
      const labsStore = labs(undefined, {
        type: fetchLabsSuccess.type,
        payload: { content: expectedLabs, hasPrevious: false, hasNext: false } as Page<Lab>,
      })

      expect(labsStore.isLoading).toBeFalsy()
      expect(labsStore.labs.content).toEqual(expectedLabs)
    })
  })

  describe('searchLabs', () => {
    beforeEach(() => {
      const mockedLabRepository = mocked(LabRepository, true)
      jest.spyOn(LabRepository, 'findAllPaged')
      jest.spyOn(LabRepository, 'searchPaged')

      mockedLabRepository.findAllPaged.mockResolvedValue(
        new Promise<Page<Lab>>((resolve) => {
          const pagedResult: Page<Lab> = {
            content: [],
            hasPrevious: false,
            hasNext: false,
          }
          resolve(pagedResult)
        }),
      )

      mockedLabRepository.searchPaged.mockResolvedValue(
        new Promise<Page<Lab>>((resolve) => {
          const pagedResult: Page<Lab> = {
            content: [],
            hasPrevious: false,
            hasNext: false,
          }
          resolve(pagedResult)
        }),
      )
    })

    it('should dispatch the FETCH_LABS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchLabs('search string', 'all')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchLabsStart.type })
    })

    it('should call the LabRepository search method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status, UnpagedRequest)(
        dispatch,
        getState,
        null,
      )

      expect(LabRepository.searchPaged).toHaveBeenCalledWith(expectedSearchObject, UnpagedRequest)
    })

    it('should call the LabRepository findAll method if there is no string text and status is set to all', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchLabs('', expectedSearchObject.status)(dispatch, getState, null)

      expect(LabRepository.findAllPaged).toHaveBeenCalledTimes(1)
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
      mockedLabRepository.searchPaged.mockResolvedValue(
        new Promise<Page<Lab>>((resolve) => {
          resolve({ content: expectedLabs, hasNext: false, hasPrevious: false })
        }),
      )

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchLabsSuccess.type,
        payload: { content: expectedLabs, hasNext: false, hasPrevious: false } as Page<Lab>,
      })
    })
  })

  describe('sort Request', () => {
    it('should have called findAllPaged with sort request in searchLabs method', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'findAllPaged')

      await searchLabs('', expectedSearchObject.status)(dispatch, getState, null)

      expect(LabRepository.findAllPaged).toHaveBeenCalledWith(
        expectedSearchObject.defaultSortRequest,
        UnpagedRequest,
      )
    })

    it('should include sorts in the search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(LabRepository, 'searchPaged')

      await searchLabs(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(LabRepository.searchPaged).toHaveBeenCalledWith(expectedSearchObject, UnpagedRequest)
    })
  })
})
