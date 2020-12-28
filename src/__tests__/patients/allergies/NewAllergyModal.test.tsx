/* eslint-disable no-console */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { act } from 'react-dom/test-utils'

import NewAllergyModal from '../../../patients/allergies/NewAllergyModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('New Allergy Modal', () => {
  const mockPatient = {
    id: '123',
    givenName: 'someName',
  } as Patient

  const setup = (onCloseSpy = jest.fn()) => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(mockPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)

    return render(
      <NewAllergyModal patientId={mockPatient.id} show onCloseButtonClick={onCloseSpy} />,
    )
  }

  beforeEach(() => {
    console.error = jest.fn()
  })

  it('should render a modal with the correct labels', () => {
    setup()
    const modal = screen.getByRole('dialog')
    const cancelButton = screen.getByRole('button', { name: /actions.cancel/i })
    const successButton = screen.getByRole('button', { name: /patient.allergies.new/i })

    expect(modal).toBeInTheDocument()
    expect(screen.getByText('patient.allergies.new', { selector: 'div' })).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveClass('btn-danger')
    expect(successButton).toBeInTheDocument()
    expect(successButton).toHaveClass('btn-success')
    expect(successButton.children[0]).toHaveAttribute('data-icon', 'plus')
  })

  it('should display errors when there is an error saving', async () => {
    const expectedError = {
      message: 'patient.allergies.error.unableToAdd',
      nameError: 'patient.allergies.error.nameRequired',
    }
    setup()
    const successButton = screen.getByRole('button', { name: /patient.allergies.new/i })
    const nameField = screen.getByLabelText(/patient.allergies.allergyName/i)

    userEvent.click(successButton)
    const alert = await screen.findByRole('alert')

    expect(alert).toBeInTheDocument()
    expect(screen.getByText(/states.error/i)).toBeInTheDocument()
    expect(screen.getByText(expectedError.message)).toBeInTheDocument()
    expect(nameField).toHaveClass('is-invalid')
    expect(nameField.nextSibling).toHaveTextContent(expectedError.nameError)
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      setup(onCloseButtonClickSpy)

      userEvent.click(screen.getByRole('button', { name: /actions.cancel/i }))
      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    it('should save the allergy for the given patient', async () => {
      const expectedName = 'expected name'
      setup()

      userEvent.type(screen.getByLabelText(/patient.allergies.allergyName/i), expectedName)
      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: /patient.allergies.new/i }))
      })

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          allergies: [expect.objectContaining({ name: expectedName })],
        }),
      )
    })
  })
})
