import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import CarePlan from '../../shared/model/CarePlan'

async function getCarePlan(_: string, patientId: string, allergyId: string): Promise<CarePlan> {
  const patient = await PatientRepository.find(patientId)
  const maybeCarePlan = patient.carePlans?.find((a) => a.id === allergyId)
  if (!maybeCarePlan) {
    throw new Error('Care Plan not found')
  }

  return maybeCarePlan
}

export default function useCarePlan(patientId: string, carePlanId: string) {
  return useQuery(['care-plans', patientId, carePlanId], getCarePlan)
}
