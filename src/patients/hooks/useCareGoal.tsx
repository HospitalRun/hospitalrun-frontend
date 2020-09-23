import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import CareGoal from '../../shared/model/CareGoal'

async function getCareGoal(_: string, patientId: string, careGoalId: string): Promise<CareGoal> {
  const patient = await PatientRepository.find(patientId)
  const maybeCareGoal = patient.careGoals?.find((c) => c.id === careGoalId)

  if (!maybeCareGoal) {
    throw new Error('Care Goal not found')
  }

  return maybeCareGoal
}

export default function useCareGoal(patientId: string, careGoalId: string) {
  return useQuery(['care-goals', patientId, careGoalId], getCareGoal)
}
