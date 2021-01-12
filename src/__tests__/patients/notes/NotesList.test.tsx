import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import NotesList from '../../../patients/notes/NotesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Note from '../../../shared/model/Note'
import Patient from '../../../shared/model/Patient'

describe('Notes list', () => {
  const setup = (notes: Note[]) => {
    const mockPatient = { id: '123', notes } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${mockPatient.id}/notes`)

    return {
      history,
      ...render(
        <Router history={history}>
          <NotesList patientId={mockPatient.id} />
        </Router>,
      ),
    }
  }

  it('should render a list of notes', async () => {
    const expectedNotes = [
      {
        id: '456',
        text: 'some name',
        date: '1947-09-09T14:48:00.000Z',
      },
      {
        id: '457',
        text: 'some name',
        date: '1947-09-10T14:48:00.000Z',
      },
    ]
    setup(expectedNotes)

    const dateString = new Date(expectedNotes[0].date).toLocaleString()
    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: `${dateString} some name`,
        }),
      ).toBeInTheDocument()
    })

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('should display a warning when no notes are present', async () => {
    const expectedNotes: Note[] = []
    setup(expectedNotes)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/patient\.notes\.warning\.nonotes/i)).toBeInTheDocument()
    expect(screen.getByText(/patient\.notes\.addnoteabove/i)).toBeInTheDocument()
  })

  it('should navigate to the note view when the note is clicked', async () => {
    const expectedNotes = [{ id: '456', text: 'some name', date: '1947-09-09T14:48:00.000Z' }]
    const { history } = setup(expectedNotes)

    const dateString = new Date(expectedNotes[0].date).toLocaleString()
    const item = await screen.findByRole('button', {
      name: `${dateString} some name`,
    })

    userEvent.click(item)

    expect(history.location.pathname).toEqual(`/patients/123/notes/${expectedNotes[0].id}`)
  })
})
