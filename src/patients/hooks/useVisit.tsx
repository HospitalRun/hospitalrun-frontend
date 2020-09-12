import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Visit from '../../shared/model/Visit'

async function fetchVisit(_: any, patientId: string, visitsId: string): Promise<Visit | null> {
  const { visits } = await PatientRepository.find(patientId)
  return visits.find(({ id }) => id === visitsId) || null
}

export default function useVisit(patientId: string, visitsId: string) {
  return useQuery(['patientVisit', patientId, visitsId], fetchVisit)
}
