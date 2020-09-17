import { useQuery } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import SortRequest from '../../shared/db/SortRequest'
import Lab from '../../shared/model/Lab'

type status = 'requested' | 'completed' | 'canceled' | 'all'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

function fetchLabs(_: any, text: string, status: status): Promise<Lab[]> {
  if (text.trim() === '' && status === 'all') {
    return LabRepository.findAll(defaultSortRequest)
  }

  return LabRepository.search({
    text,
    status,
    defaultSortRequest,
  })
}

export default function useLabsSearch(text: string, status: status) {
  return useQuery(['labs', text, status], fetchLabs)
}
