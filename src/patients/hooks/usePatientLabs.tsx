import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'

async function fetchPatientLabs(_: string, patientId: string): Promise<Lab[]> {
  const fetchedLabs = await PatientRepository.getLabs(patientId)
  return fetchedLabs || []
}

export default function usePatientLabs(patientId: string) {
  return useQuery(['labs', patientId], fetchPatientLabs)
}
