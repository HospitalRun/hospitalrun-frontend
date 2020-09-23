import { useQuery } from 'react-query'

import ImagingRepository from '../../shared/db/ImagingRepository'
import SortRequest from '../../shared/db/SortRequest'
import Imaging from '../../shared/model/Imaging'
import ImagingSearchRequest from '../model/ImagingSearchRequest'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

function searchImagingRequests(_: string, searchRequest: ImagingSearchRequest): Promise<Imaging[]> {
  return ImagingRepository.search({ ...searchRequest, defaultSortRequest })
}

export default function useImagingSearch(searchRequest: ImagingSearchRequest) {
  return useQuery(['imagings', searchRequest], searchImagingRequests)
}
