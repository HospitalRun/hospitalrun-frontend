import { QueryKey, useQuery } from 'react-query'

import ImagingSearchRequest from '../model/ImagingSearchRequest'
import ImagingRepository from '../../shared/db/ImagingRepository'
import SortRequest from '../../shared/db/SortRequest'
import Imaging from '../../shared/model/Imaging'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

function searchImagingRequests(
  _: QueryKey<string>,
  searchRequest: ImagingSearchRequest,
): Promise<Imaging[]> {
  return ImagingRepository.search({ ...searchRequest, defaultSortRequest })
}

export default function useImagingSearch(searchRequest: ImagingSearchRequest) {
  return useQuery(['imagings', searchRequest], searchImagingRequests)
}
