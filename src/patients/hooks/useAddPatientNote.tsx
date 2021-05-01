import isEmpty from 'lodash/isEmpty'
import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Note from '../../shared/model/Note'
import validateNote from '../util/validate-note'

interface AddNoteRequest {
  patientId: string
  note: Note
}

async function addNote(request: AddNoteRequest): Promise<Note[]> {
  const error = validateNote(request.note)

  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const notes = patient.notes ? [...patient.notes] : []
    notes.push(request.note)

    await PatientRepository.saveOrUpdate({
      ...patient,
      notes,
    })

    return notes
  }

  throw error
}

export default function useAddPatientNote() {
  return useMutation(addNote, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['notes', variables.patientId], data)
    },
    throwOnError: true,
  })
}
