import { useQuery } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import SortRequest from '../../shared/db/SortRequest'
import Lab from '../../shared/model/Lab'
import LabSearchRequest from '../model/LabSearchRequest'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

function fetchLabs(_: any, request: LabSearchRequest): Promise<Lab[]> {
  if (request.text?.trim() === '' && request.status === 'all') {
    return LabRepository.findAll(defaultSortRequest)
  }

  return LabRepository.search({
    ...request,
    defaultSortRequest,
  } as any)
}

export default function useLabsSearch(request: LabSearchRequest) {
  return useQuery(['labs', request], fetchLabs)
}
