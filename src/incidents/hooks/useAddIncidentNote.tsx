import { isEmpty } from 'lodash'
import { queryCache, useMutation } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Note from '../../shared/model/Note'

interface AddNoteRequest {
  incidentId: string
  note: Note
}

async function addNote(request: AddNoteRequest): Promise<Note[]> {
  const incident = await IncidentRepository.find(request.incidentId)
  const notes = incident.notes || []
  let noteIdx = notes.findIndex((note) => note.id === request.note.id)
  if (noteIdx === -1) {
    // This note is new.
    notes.push(request.note)
  } else {
    // We're editing an already existing note.
    notes[noteIdx] = request.note
  }

  await IncidentRepository.saveOrUpdate({
    ...incident,
    notes,
  })

  return notes
}

export default function useAddIncidentNote() {
  return useMutation(addNote, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['notes', variables.incidentId], data)
    },
    throwOnError: true,
  })
}
