import { useQuery, QueryKey } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Visit from '../../shared/model/Visit'

async function fetchVisit(
  _: QueryKey<string>,
  patientId: string,
  visitsId: string,
): Promise<Visit | undefined> {
  const { visits } = await PatientRepository.find(patientId)
  return visits.find(({ id }) => id === visitsId) || undefined
}

export default function useVisit(patientId: string, visitsId: string) {
  return useQuery(['visits', patientId, visitsId], fetchVisit)
}
