import isEmpty from 'lodash/isEmpty'
import { useMutation, queryCache } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import RelatedPerson from '../../shared/model/RelatedPerson'
import { uuid } from '../../shared/util/uuid'
import validateRelatedPerson from '../util/validate-related-person'

interface AddRelatedPersonRequest {
  patientId: string
  relatedPerson: Omit<RelatedPerson, 'id'>
}

async function addRelatedPerson(request: AddRelatedPersonRequest): Promise<RelatedPerson[]> {
  const error = validateRelatedPerson(request.relatedPerson)

  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const relatedPersons = patient.relatedPersons ? [...patient.relatedPersons] : []
    const newRelated: RelatedPerson = {
      id: uuid(),
      ...request.relatedPerson,
    }
    relatedPersons.push(newRelated)

    await PatientRepository.saveOrUpdate({
      ...patient,
      relatedPersons,
    })

    return relatedPersons
  }

  throw error
}

export default function useAddPatientRelatedPerson() {
  return useMutation(addRelatedPerson, {
    onSuccess: async (data, variables) => {
      const relatedPersons = await Promise.all(
        data.map(async (rp) => {
          const patient = await PatientRepository.find(rp.patientId)
          return { ...patient, type: rp.type }
        }),
      )
      await queryCache.setQueryData(['related-persons', variables.patientId], relatedPersons)
    },
    throwOnError: true,
  })
}
