import { Alert, List, ListItem } from '@hospitalrun/components'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Note from '../../shared/model/Note'
import usePatientNotes from '../hooks/usePatientNotes'

interface Props {
  patientId: string
}

const NotesList = (props: Props) => {
  const { patientId } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientNotes(patientId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.notes.warning.noNotes')}
        message={t('patient.notes.addNoteAbove')}
      />
    )
  }

  return (
    <List>
      {data.map((note: Note) => (
        <ListItem
          action
          key={note.id}
          onClick={() => history.push(`/patients/${patientId}/notes/${note.id}`)}
        >
          <p className="ref__note-item-date">{new Date(note.date).toLocaleString()}</p>
          <p role="listitem" className="ref__note-item-text">
            {note.text}
          </p>
        </ListItem>
      ))}
    </List>
  )
}

export default NotesList
