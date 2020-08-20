import { QueryKey, useQuery } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

function fetchIncidents(
  _: QueryKey<string>,
  searchRequest: IncidentSearchRequest,
): Promise<Incident[]> {
  return IncidentRepository.search(searchRequest)
}

export default function useIncidents(searchRequest: IncidentSearchRequest) {
  return useQuery(['incidents', searchRequest], fetchIncidents)
}
