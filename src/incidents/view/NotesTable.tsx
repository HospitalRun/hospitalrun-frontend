import { Alert, Table } from '@hospitalrun/components'
import React from 'react'

import useTranslator from '../../shared/hooks/useTranslator'
import Note from '../../shared/model/Note'
import { extractUsername } from '../../shared/util/extractUsername'

interface Props {
  onEditNote: (note: Note) => void
  onDeleteNote: (note: Note) => void
  notes: Note[]
}

const NotesTable = ({ onEditNote, onDeleteNote, notes }: Props) => {
  const { t } = useTranslator()

  if (notes.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.notes.warning.noNotes')}
        message={t('patient.notes.addNoteAbove')}
      />
    )
  }

  return (
    <Table
      columns={[
        {
          key: 'date-key',
          label: 'Date',
          formatter: (row) => <>{new Date(row.date).toLocaleDateString()}</>,
        },
        {
          key: 'given-by-key',
          label: 'Given By',
          formatter: (row) => <>{extractUsername(row.givenBy || '')}</>,
        },
        {
          key: 'note-key',
          label: 'Note',
          formatter: (row) => <>{row.text}</>,
        },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: t('actions.edit'),
          action: onEditNote,
          buttonColor: 'dark',
        },
        {
          label: t('actions.delete'),
          action: onDeleteNote,
          buttonColor: 'danger',
        },
      ]}
      data={notes}
      getID={(r) => r.id}
    />
  )
}

export default NotesTable
