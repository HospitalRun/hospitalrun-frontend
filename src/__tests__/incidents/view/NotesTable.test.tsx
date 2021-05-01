import { Alert, Table } from '@hospitalrun/components'
import React from 'react'
import { act } from 'react-dom/test-utils'

import NotesTable from '../../../incidents/view/NotesTable'
import Note from '../../../shared/model/Note'

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const MOCK_NOTE = {
  id: '1234',
  date: new Date().toISOString(),
  text: 'some text',
  givenBy: 'some user',
}

const setup = (
  notes: Note[]
) => {

  const onEditSpy = jest.fn();
  const onDeleteSpy = jest.fn();

  render(
    <NotesTable onEditNote={onEditSpy} onDeleteNote={onDeleteSpy} notes={notes}/>
  )

  return { onEditSpy, onDeleteSpy }
}

describe('Notes Table', () => {

  it('should render a notes table if at least note is in list.', async () => {
    setup([ MOCK_NOTE ] )
    
    expect(screen.getByRole("table")).toBeInTheDocument();
  })
  it('should display edit and delete buttons if notes exist', async () => {
    setup([ MOCK_NOTE ] )
    expect(screen.getByRole("button", { name: "actions.edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "actions.delete" })).toBeInTheDocument();
  })
  
  it('should display no notes message if no notes exist', async () => {
    setup([])
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("patient.notes.warning.noNotes")).toBeInTheDocument();
  })

  it('calls on edit note when edit note button clicked', async () => {
    const { onEditSpy } = setup([ MOCK_NOTE ])
    fireEvent.click(screen.getByRole("button", { name: "actions.edit" }))
    expect(onEditSpy).toHaveBeenCalled();
  })
  
  it('calls on delete note when delete note button clicked', async () => {
    const { onDeleteSpy } = setup([ MOCK_NOTE ])
    fireEvent.click(screen.getByRole("button", { name: "actions.delete" }));
    expect(onDeleteSpy).toHaveBeenCalled();
  })
})
