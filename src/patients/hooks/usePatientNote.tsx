import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Note from '../../shared/model/Note'

async function getNote(_: string, patientId: string, noteId: string): Promise<Note> {
  const patient = await PatientRepository.find(patientId)
  const maybeNote = patient.notes?.find((n) => n.id === noteId)

  if (!maybeNote) {
    throw new Error('Note not found')
  }

  return maybeNote
}

export default function usePatientNote(patientId: string, noteId: string) {
  return useQuery(['notes', patientId, noteId], getNote)
}
