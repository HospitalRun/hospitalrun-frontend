import { isEmpty } from 'lodash'
import { queryCache, useMutation } from 'react-query'

import IncidentRepository from '../../shared/db/IncidentRepository'
import Note from '../../shared/model/Note'
// import validateNote from '../util/validate-note'

interface AddNoteRequest {
  incidentId: string
  note: Note
}

async function addNote(request: AddNoteRequest): Promise<Note[]> {
  const error = [] as any // TODO validateNote(request.note)

  if (isEmpty(error)) {
    const incident = await IncidentRepository.find(request.incidentId)

    const notes = (incident.notes && incident.notes.filter((note) => note.id !== request.note.id)) || []

    notes.push(request.note)

    await IncidentRepository.saveOrUpdate({
      ...incident,
      notes
    })

    return notes
  }

  throw error
}

export default function useAddIncidentNote() {
  return useMutation(addNote, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['notes', variables.incidentId], data)
    },
    throwOnError: true,
  })
}
