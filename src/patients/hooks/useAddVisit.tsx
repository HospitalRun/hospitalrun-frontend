import isEmpty from 'lodash/isEmpty'
import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Visit from '../../shared/model/Visit'
import { uuid } from '../../shared/util/uuid'
import validateVisit from '../util/validate-visit'

export type RequestVisit = Omit<Visit, 'id' | 'createdAt'>
interface AddVisitRequest {
  patientId: string
  visit: RequestVisit
}

async function addVisit(request: AddVisitRequest): Promise<Visit[]> {
  const error = validateVisit(request.visit)
  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const visits = patient.visits || ([] as Visit[])
    visits.push({
      id: uuid(),
      createdAt: new Date(Date.now().valueOf()).toISOString(),
      ...request.visit,
    })
    await PatientRepository.saveOrUpdate({
      ...patient,
      visits,
    })
    return visits
  }
  error.message = 'patient.visits.error.unableToAdd'
  throw error
}

export default function useAddVisit() {
  return useMutation(addVisit, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['visits', variables.patientId], data)
    },
    throwOnError: true,
  })
}
