import React from 'react'

import { Table } from '@hospitalrun/components'

const NotesTable = () => {
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
      data={[
        {
          id: 'agupta07',
          date: '2020-12-18T00:34:51.414Z',
          text: 'Vaccine Failed',
          givenBy: 'Dr. Gupta',
        },
        {
          id: 'drewgreg',
          date: '2020-12-17T00:34:51.414Z',
          text: 'Vaccine Success!',
          givenBy: 'Dr. Gregory',
        },
      ]}
      getID={(r) => r.id}
    />
  )
}

export default NotesTable
