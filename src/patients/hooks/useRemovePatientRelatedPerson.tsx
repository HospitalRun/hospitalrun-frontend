import { useMutation, queryCache } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import RelatedPerson from '../../shared/model/RelatedPerson'

interface removeRelatedPersonRequest {
  patientId: string
  relatedPersonId: string
}

async function removeRelatedPerson(request: removeRelatedPersonRequest): Promise<RelatedPerson[]> {
  const patient = await PatientRepository.find(request.patientId)
  const relatedPersons = patient.relatedPersons
    ? patient.relatedPersons.filter((rp) => rp.patientId !== request.relatedPersonId)
    : []
  await PatientRepository.saveOrUpdate({
    ...patient,
    relatedPersons,
  })

  return relatedPersons
}

export default function useRemovePatientRelatedPerson() {
  return useMutation(removeRelatedPerson, {
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
