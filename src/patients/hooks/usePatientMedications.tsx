import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'

async function fetchPatientMedications(_: string, patientId: string): Promise<Medication[]> {
  const fetchedMedications = await PatientRepository.getMedications(patientId)
  return fetchedMedications || []
}

export default function usePatientMedications(patientId: string) {
  return useQuery(['medications', patientId], fetchPatientMedications)
}
