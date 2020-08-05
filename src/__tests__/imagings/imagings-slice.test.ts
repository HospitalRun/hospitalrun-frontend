import { AnyAction } from 'redux'
import { mocked } from 'ts-jest/utils'

import imagings, {
  fetchImagingsStart,
  fetchImagingsSuccess,
  searchImagings,
} from '../../imagings/imagings-slice'
import ImagingRepository from '../../shared/db/ImagingRepository'
import SortRequest from '../../shared/db/SortRequest'
import Imaging from '../../shared/model/Imaging'

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

describe('imagings slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('imagings reducer', () => {
    it('should create the proper intial state with empty imagings array', () => {
      const imagingsStore = imagings(undefined, {} as AnyAction)
      expect(imagingsStore.isLoading).toBeFalsy()
      expect(imagingsStore.imagings).toHaveLength(0)
      expect(imagingsStore.statusFilter).toEqual('all')
    })

    it('it should handle the FETCH_IMAGINGS_SUCCESS action', () => {
      const expectedImagings = [{ id: '1234' }]
      const imagingsStore = imagings(undefined, {
        type: fetchImagingsSuccess.type,
        payload: expectedImagings,
      })

      expect(imagingsStore.isLoading).toBeFalsy()
      expect(imagingsStore.imagings).toEqual(expectedImagings)
    })
  })

  describe('searchImagings', () => {
    it('should dispatch the FETCH_IMAGINGS_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      await searchImagings('search string', 'all')(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: fetchImagingsStart.type })
    })

    it('should call the ImagingRepository search method with the correct search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(ImagingRepository, 'search')

      await searchImagings(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(ImagingRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })

    it('should call the ImagingRepository findAll method if there is no string text and status is set to all', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(ImagingRepository, 'findAll')

      await searchImagings('', expectedSearchObject.status)(dispatch, getState, null)

      expect(ImagingRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should dispatch the FETCH_IMAGINGS_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()

      const expectedImagings = [
        {
          type: 'text',
        },
      ] as Imaging[]

      const mockedImagingRepository = mocked(ImagingRepository, true)
      mockedImagingRepository.search.mockResolvedValue(expectedImagings)

      await searchImagings(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenLastCalledWith({
        type: fetchImagingsSuccess.type,
        payload: expectedImagings,
      })
    })
  })

  describe('sort Request', () => {
    it('should have called findAll with sort request in searchImagings method', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(ImagingRepository, 'findAll')

      await searchImagings('', expectedSearchObject.status)(dispatch, getState, null)

      expect(ImagingRepository.findAll).toHaveBeenCalledWith(
        expectedSearchObject.defaultSortRequest,
      )
    })

    it('should include sorts in the search criteria', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(ImagingRepository, 'search')

      await searchImagings(expectedSearchObject.text, expectedSearchObject.status)(
        dispatch,
        getState,
        null,
      )

      expect(ImagingRepository.search).toHaveBeenCalledWith(expectedSearchObject)
    })
  })
})
