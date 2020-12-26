import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import NewNoteModal from '../../../patients/notes/NewNoteModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('New Note Modal', () => {
  const mockPatient = {
    id: '123',
    givenName: 'someName',
  } as Patient

  const onCloseSpy = jest.fn()
  const render = () => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(mockPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)
    const results = rtlRender(
      <NewNoteModal
        show
        onCloseButtonClick={onCloseSpy}
        toggle={jest.fn()}
        patientId={mockPatient.id}
      />,
    )
    return results
  }

  it('should render a modal with the correct labels', () => {
    render()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    waitFor(() => expect(screen.getByText(/patient\.notes\.new/i)).toBeInTheDocument())

    const successButton = screen.getByRole('button', {
      name: /patient\.notes\.new/i,
    })
    const cancelButton = screen.getByRole('button', {
      name: /actions\.cancel/i,
    })

    expect(cancelButton).toHaveClass('btn-danger')
    expect(successButton).toHaveClass('btn-success')
    expect(successButton.querySelector('svg')).toHaveAttribute('data-icon', 'plus')
  })

  it('should render a notes rich text editor', async () => {
    render()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('patient.note').querySelector('svg')).toHaveAttribute(
      'data-icon',
      'asterisk',
    )
  })

  it('should render note error', async () => {
    const expectedError = {
      message: 'patient.notes.error.unableToAdd',
      note: 'patient.notes.error.noteRequired',
    }
    render()

    userEvent.click(
      screen.getByRole('button', {
        name: /patient\.notes\.new/i,
      }),
    )

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/states.error/i)).toBeInTheDocument()
    expect(screen.getByText(expectedError.message)).toBeInTheDocument()
    expect(screen.getByText(expectedError.note)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid')
  })

  describe('on cancel', () => {
    it('should call the onCloseButtonCLick function when the cancel button is clicked', () => {
      render()

      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      )
      waitFor(() => expect(onCloseSpy).toHaveBeenCalledTimes(1))
    })
  })

  describe('on save', () => {
    it('should dispatch add note', async () => {
      const expectedNote = 'some note'
      render()

      const noteTextField = screen.getByRole('textbox')
      userEvent.type(noteTextField, expectedNote)

      userEvent.click(
        screen.getByRole('button', {
          name: /patient\.notes\.new/i,
        }),
      )
      waitFor(() => {
        expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
        expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            notes: [expect.objectContaining({ text: expectedNote })],
          }),
        )
        // Does the form reset value back to blank?
        expect(noteTextField).toHaveValue('')
      })
    })
  })
})
