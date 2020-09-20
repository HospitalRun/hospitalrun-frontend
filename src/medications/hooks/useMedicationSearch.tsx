import { useQuery } from 'react-query'

import MedicationRepository from '../../shared/db/MedicationRepository'
import SortRequest from '../../shared/db/SortRequest'
import Medication from '../../shared/model/Medication'
import MedicationSearchRequest from '../models/MedicationSearchRequest'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

function searchMedicationRequests(
  _: string,
  searchRequest: MedicationSearchRequest,
): Promise<Medication[]> {
  return MedicationRepository.search({
    ...searchRequest,
    defaultSortRequest,
  })
}

export default function useMedicationSearch(searchRequest: MedicationSearchRequest) {
  return useQuery(['medication-requests', searchRequest], searchMedicationRequests)
}
