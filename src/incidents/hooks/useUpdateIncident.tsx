import { queryCache, useMutation } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'

interface ResolvedOnDate {
  resolvedOn?: string
}

/**
 * Returns incident object with resolvedOn string if incident.status was resolved on, otherwise returns empty object
 * @param {Incident} incident
 * @returns {ResolvedOnDate}
 */
function getResolvedOn(incident: Incident): ResolvedOnDate {
  return incident.status === 'resolved' ? { resolvedOn: new Date(Date.now()).toISOString() } : {}
}

function resolveIncident(incident: Incident): Promise<Incident> {
  const resolvedOn = getResolvedOn(incident)
  return IncidentRepository.saveOrUpdate({
    ...incident,
    ...resolvedOn,
  })
}

export default function useUpdateIncident() {
  return useMutation(resolveIncident, {
    onSuccess: async (data: Incident) => {
      queryCache.setQueryData(['incident', data.id], data)
    },
  })
}
