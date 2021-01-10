import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import NewAllergyModal from '../../../patients/allergies/NewAllergyModal'
import Patient from '../../../shared/model/Patient'
import { expectOneConsoleError } from '../../test-utils/console.utils'

describe('New Allergy Modal', () => {
  const mockPatient = {
    id: '123',
    givenName: 'someName',
  } as Patient

  const setup = () =>
    render(<NewAllergyModal patientId={mockPatient.id} show onCloseButtonClick={jest.fn()} />)

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
    const expectedErrorMessage = 'patient.allergies.error.unableToAdd'
    const expectedError = {
      nameError: 'patient.allergies.error.nameRequired',
    }
    expectOneConsoleError(expectedError)
    setup()
    const successButton = screen.getByRole('button', { name: /patient.allergies.new/i })
    const nameField = screen.getByLabelText(/patient.allergies.allergyName/i)

    userEvent.click(successButton)
    const alert = await screen.findByRole('alert')

    expect(alert).toBeInTheDocument()
    expect(screen.getByText(/states.error/i)).toBeInTheDocument()
    expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument()
    expect(nameField).toHaveClass('is-invalid')
    expect(nameField.nextSibling).toHaveTextContent(expectedError.nameError)
  })
})
