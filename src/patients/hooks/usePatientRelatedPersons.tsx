import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'

interface RelatedPersonsResult extends Patient {
  type: string
}

async function fetchPatientRelatedPersons(
  _: any,
  patientId: string,
): Promise<RelatedPersonsResult[]> {
  const patient = await PatientRepository.find(patientId)
  const relatedPersons = patient.relatedPersons || []
  const result = await Promise.all(
    relatedPersons.map(async (person) => {
      const fetchedRelatedPerson = await PatientRepository.find(person.patientId)
      return { ...fetchedRelatedPerson, type: person.type }
    }),
  )

  return result
}

export default function usePatientRelatedPersons(patientId: string) {
  return useQuery(['related-persons', patientId], fetchPatientRelatedPersons)
}
