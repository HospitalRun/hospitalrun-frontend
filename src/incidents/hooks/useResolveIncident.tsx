import { queryCache, useMutation } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'

function resolveIncident(incident: Incident): Promise<Incident> {
  return IncidentRepository.saveOrUpdate({
    ...incident,
    resolvedOn: new Date(Date.now()).toISOString(),
    status: 'resolved',
  })
}

export default function useResolveIncident() {
  return useMutation(resolveIncident, {
    onSuccess: async (data: Incident) => {
      queryCache.setQueryData(['incident', data.id], data)
    },
  })
}
