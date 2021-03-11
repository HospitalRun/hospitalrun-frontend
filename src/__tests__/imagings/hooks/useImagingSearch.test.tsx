import useImagingSearch from '../../../imagings/hooks/useImagingSearch'
import ImagingSearchRequest from '../../../imagings/model/ImagingSearchRequest'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Imaging from '../../../shared/model/Imaging'
import executeQuery from '../../test-utils/use-query.util'

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

    const actualData = await executeQuery(() => useImagingSearch(expectedSearchRequest))

    expect(ImagingRepository.search).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.search).toBeCalledWith({
      ...expectedSearchRequest,
      defaultSortRequest,
    })
    expect(actualData).toEqual(expectedImagingRequests)
  })
})
