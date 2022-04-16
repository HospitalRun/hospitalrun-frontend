import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import NotesTable from '../../../incidents/view/NotesTable'
import Note from '../../../shared/model/Note'

const mockNote = {
  id: '1234',
  date: new Date().toISOString(),
  text: 'some text',
  givenBy: 'some user',
} as Note

const setup = (notes: Note[] = [mockNote]) => {
  const onEditSpy = jest.fn()
  const onDeleteSpy = jest.fn()

  render(<NotesTable onEditNote={onEditSpy} onDeleteNote={onDeleteSpy} notes={notes} />)

  return { onEditSpy, onDeleteSpy }
}

describe('Notes Table', () => {
  it('should render a notes table if at least one note is in the list.', async () => {
    setup()

    expect(screen.getByRole('table')).toBeInTheDocument()
  })
  it('should display edit and delete buttons if notes exist', async () => {
    setup()
    expect(screen.getByRole('button', { name: 'actions.edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.delete' })).toBeInTheDocument()
  })

  it('should display no notes message if no notes exist', async () => {
    setup([])
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('patient.notes.warning.noNotes')).toBeInTheDocument()
  })

  it('calls on edit note when edit note button clicked', async () => {
    const { onEditSpy } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'actions.edit' }))
    expect(onEditSpy).toHaveBeenCalled()
  })

  it('calls on delete note when delete note button clicked', async () => {
    const { onDeleteSpy } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'actions.delete' }))
    expect(onDeleteSpy).toHaveBeenCalled()
  })
})
