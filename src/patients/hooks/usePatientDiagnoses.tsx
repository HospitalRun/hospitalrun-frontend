import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Diagnosis from '../../shared/model/Diagnosis'

async function fetchPatientDiagnoses(_: string, patientId: string): Promise<Diagnosis[]> {
  const patient = await PatientRepository.find(patientId)
  return patient.diagnoses || []
}

export default function usePatientDiagnoses(patientId: string) {
  return useQuery(['diagnoses', patientId], fetchPatientDiagnoses)
}
