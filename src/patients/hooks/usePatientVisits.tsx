import { useQuery, QueryKey } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Visit from '../../shared/model/Visit'

async function fetchPatientVisits(_: QueryKey<string>, id: string): Promise<Visit[]> {
  return (await PatientRepository.find(id)).visits
}

export default function usePatientVisits(id: string) {
  return useQuery(['visits', id], fetchPatientVisits)
}
