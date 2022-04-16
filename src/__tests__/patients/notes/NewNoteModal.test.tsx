import { screen, render, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Note from '../../../shared/model/Note'
import NewNoteModal from '../../../shared/notes/NewNoteModal'
import { expectOneConsoleError } from '../../test-utils/console.utils'

describe('New Note Modal', () => {
  const expectedSaveDate = new Date()

  const mockNote: Note = {
    id: 'note id',
    text: 'note text',
    givenBy: 'given by person',
  } as Note

  const noTextNote: Note = {
    id: 'note id',
    text: '',
    givenBy: 'given by person',
  } as Note

  const setup = (onCloseSpy = jest.fn(), onSaveSpy = jest.fn(), note = mockNote) => {
    Date.now = jest.fn(() => expectedSaveDate.valueOf())
    return render(
      <NewNoteModal
        show
        onCloseButtonClick={onCloseSpy}
        toggle={jest.fn()}
        onSave={onSaveSpy}
        setNote={jest.fn()}
        note={note}
      />,
    )
  }

  it('should render a modal with the correct labels', async () => {
    setup()

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(/patient\.notes\.new/i, { selector: 'script, style, button' }),
    ).toBeInTheDocument()

    const successButton = screen.getByRole('button', {
      name: /patient\.notes\.new/i,
    })
    const cancelButton = screen.getByRole('button', {
      name: /actions\.cancel/i,
    })

    expect(cancelButton).toHaveClass('btn-danger')
    expect(successButton).toHaveClass('btn-success')
    expect(within(successButton).getByRole('img')).toHaveAttribute('data-icon', 'plus')
  })

  it("should render 'Edit Note' title and button if date object is specified", async () => {
    setup(jest.fn(), jest.fn(), { ...mockNote, date: new Date().toISOString() })

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/patient\.notes\.edit/i, { selector: 'div' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /patient\.notes\.edit/i })).toBeInTheDocument()
  })

  it('should render a notes rich text editor', () => {
    setup()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(within(screen.getByText('patient.note')).getByRole('img')).toHaveAttribute(
      'data-icon',
      'asterisk',
    )
  })

  it('should render note error', async () => {
    const expectedErrorMessage = 'patient.notes.error.unableToAdd'
    const expectedError = {
      noteError: 'patient.notes.error.noteRequired',
    }
    expectOneConsoleError(expectedError)

    setup(jest.fn(), jest.fn(), noTextNote)

    userEvent.click(
      screen.getByRole('button', {
        name: /patient\.notes\.new/i,
      }),
    )

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/states.error/i)).toBeInTheDocument()
    expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument()
    expect(screen.getByText(expectedError.noteError)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid')
  })

  describe('on cancel', () => {
    it('should call the onCloseButtonClick function when the cancel button is clicked', async () => {
      const onCloseSpy = jest.fn()
      setup(onCloseSpy)

      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      )
      await waitFor(() => expect(onCloseSpy).toHaveBeenCalledTimes(1))
    })
  })

  describe('on save', () => {
    it('should dispatch add note', async () => {
      const expectedNote = 'some note'
      const onSaveSpy = jest.fn()
      setup(jest.fn(), onSaveSpy)

      const noteTextField = screen.getByRole('textbox')
      userEvent.type(noteTextField, expectedNote)

      userEvent.click(
        screen.getByRole('button', {
          name: /patient\.notes\.new/i,
        }),
      )
      await waitFor(() => {
        expect(onSaveSpy).toHaveBeenCalledTimes(1)
      })
      expect(onSaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expectedSaveDate.toISOString(),
        }),
      )
    })
  })
})
