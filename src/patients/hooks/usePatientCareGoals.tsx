import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import CareGoal from '../../shared/model/CareGoal'

async function fetchPatientCareGoals(_: string, patientId: string): Promise<CareGoal[]> {
  const patient = await PatientRepository.find(patientId)
  return patient.careGoals || []
}

export default function usePatientCareGoals(patientId: string) {
  return useQuery(['care-goals', patientId], fetchPatientCareGoals)
}
