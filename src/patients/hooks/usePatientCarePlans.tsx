import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import CarePlan from '../../shared/model/CarePlan'

async function fetchPatientCarePlans(_: string, patientId: string): Promise<CarePlan[]> {
  const patient = await PatientRepository.find(patientId)
  return patient.carePlans || []
}

export default function usePatientCarePlans(patientId: string) {
  return useQuery(['care-plans', patientId], fetchPatientCarePlans)
}
