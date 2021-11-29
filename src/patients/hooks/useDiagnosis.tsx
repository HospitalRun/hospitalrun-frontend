import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Diagnosis from '../../shared/model/Diagnosis'

async function getDiagnosis(_: string, patientId: string, diagnosisId: string): Promise<Diagnosis> {
  const patient = await PatientRepository.find(patientId)
  const maybeDiagnosis = patient.diagnoses?.find((d) => d.id === diagnosisId)
  if (!maybeDiagnosis) {
    throw new Error('Diagnosis not found')
  }

  return maybeDiagnosis
}

export default function useDiagnosis(patientId: string, diagnosisId: string) {
  return useQuery(['diagnoses', patientId, diagnosisId], getDiagnosis, { retry: false })
}
