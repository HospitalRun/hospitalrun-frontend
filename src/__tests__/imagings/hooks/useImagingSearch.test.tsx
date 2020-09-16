import { act, renderHook } from '@testing-library/react-hooks'

import useImagingSearch from '../../../imagings/hooks/useImagingSearch'
import ImagingSearchRequest from '../../../imagings/model/ImagingSearchRequest'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Imaging from '../../../shared/model/Imaging'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

describe('useImagingSearch', () => {
  it('it should search imaging requests', async () => {
    const expectedSearchRequest: ImagingSearchRequest = {
      status: 'completed',
      text: 'some search request',
    }
    const expectedImagingRequests = [{ id: 'some id' }] as Imaging[]
    jest.spyOn(ImagingRepository, 'search').mockResolvedValue(expectedImagingRequests)

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useImagingSearch(expectedSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(ImagingRepository.search).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.search).toBeCalledWith({
      ...expectedSearchRequest,
      defaultSortRequest,
    })
    expect(actualData).toEqual(expectedImagingRequests)
  })
})
