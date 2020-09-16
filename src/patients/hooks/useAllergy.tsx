import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Allergy from '../../shared/model/Allergy'

async function getAllergy(_: string, patientId: string, allergyId: string): Promise<Allergy> {
  const patient = await PatientRepository.find(patientId)
  const maybeAllergy = patient.allergies?.find((a) => a.id === allergyId)
  if (!maybeAllergy) {
    throw new Error('Allergy not found')
  }

  return maybeAllergy
}

export default function useAllergy(patientId: string, allergyId: string) {
  return useQuery(['allergies', patientId, allergyId], getAllergy)
}
