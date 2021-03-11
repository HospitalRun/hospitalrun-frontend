import { useQuery } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'

function fetchIncidentById(_: any, incidentId: string): Promise<Incident> {
  return IncidentRepository.find(incidentId)
}

export default function useIncident(incidentId: string) {
  return useQuery(['incident', incidentId], fetchIncidentById)
}
