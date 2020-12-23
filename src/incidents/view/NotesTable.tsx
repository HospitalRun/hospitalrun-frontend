import React from 'react'

import { Table } from '@hospitalrun/components'
import Note from '../../shared/model/Note'
interface Props {
  notes: Note[]
}

const NotesTable = ({ notes }: Props) => {
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
          formatter: (row) => <>{row.givenBy}</>,
        },
        {
          key: 'note-key',
          label: 'Note',
          formatter: (row) => <>{row.text}</>,
        },
        {
          key: 'actions-key',
          label: 'Actions',
          formatter: () => {
            return (
              <>
                <button type="button">Edit</button>
                <button type="button">Delete</button>
              </>
            )
          },
        },
      ]}
      data={notes}
      getID={(r) => r.id}
    />
  )
}

export default NotesTable
