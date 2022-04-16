import { isEmpty } from 'lodash'
import { queryCache, useMutation } from 'react-query'

import validateNote from '../../patients/util/validate-note'
import IncidentRepository from '../../shared/db/IncidentRepository'
import Note from '../../shared/model/Note'

interface DeleteNoteRequest {
  incidentId: string
  note: Note
}

async function deleteNote(request: DeleteNoteRequest): Promise<Note[]> {
  const error = validateNote(request.note)

  if (isEmpty(error)) {
    const incident = await IncidentRepository.find(request.incidentId)
    let notes = incident.notes || []
    notes = notes.filter((note) => note.id !== request.note.id)

    await IncidentRepository.saveOrUpdate({
      ...incident,
      notes,
    })

    return notes
  }

  throw error
}

export default function useDeleteIncidentNote() {
  return useMutation(deleteNote, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['notes', variables.incidentId], data)
    },
    throwOnError: true,
  })
}
