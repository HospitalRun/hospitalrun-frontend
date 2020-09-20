import { QueryKey, useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Note from '../../shared/model/Note'

async function fetchPatientNotes(_: QueryKey<string>, patientId: string): Promise<Note[]> {
  const patient = await PatientRepository.find(patientId)
  return patient.notes || []
}

export default function usePatientNotes(patientId: string) {
  return useQuery(['notes', patientId], fetchPatientNotes)
}
