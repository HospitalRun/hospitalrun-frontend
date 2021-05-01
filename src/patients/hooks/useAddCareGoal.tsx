import isEmpty from 'lodash/isEmpty'
import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import CareGoal from '../../shared/model/CareGoal'
import { uuid } from '../../shared/util/uuid'
import validateCareGoal from '../util/validate-caregoal'

interface AddCareGoalRequest {
  patientId: string
  careGoal: Omit<CareGoal, 'id' | 'createdOn'>
}

async function addCareGoal(request: AddCareGoalRequest): Promise<CareGoal[]> {
  const error = validateCareGoal(request.careGoal)

  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const careGoals = patient.careGoals ? [...patient.careGoals] : []

    const newCareGoal: CareGoal = {
      id: uuid(),
      createdOn: new Date(Date.now()).toISOString(),
      ...request.careGoal,
    }
    careGoals.push(newCareGoal)

    await PatientRepository.saveOrUpdate({
      ...patient,
      careGoals,
    })

    return careGoals
  }

  error.message = 'patient.careGoal.error.unableToAdd'
  throw error
}

export default function useAddCareGoal() {
  return useMutation(addCareGoal, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['care-goals', variables.patientId], data)
    },
    throwOnError: true,
  })
}
