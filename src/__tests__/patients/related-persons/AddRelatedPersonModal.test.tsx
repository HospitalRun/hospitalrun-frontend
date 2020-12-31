import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import AddRelatedPersonModal from '../../../patients/related-persons/AddRelatedPersonModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { expectOneConsoleError } from '../../test-utils/console.utils'

describe('Add Related Person Modal', () => {
  const patient = {
    id: '123',
    fullName: 'fullName',
    code: 'code1',
  } as Patient
  const patient2 = {
    id: '456',
    fullName: 'patient2',
    code: 'code2',
  } as Patient

  const setup = () => {
    jest.resetAllMocks()
    // jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'search').mockResolvedValue([patient, patient2])
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

    return render(
      <AddRelatedPersonModal
        show
        patientId={patient.id}
        onCloseButtonClick={jest.fn()}
        toggle={jest.fn()}
      />,
    )
  }

  describe('layout', () => {
    it('should render a modal', () => {
      setup()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render a patient search typeahead', () => {
      setup()
      expect(screen.getByPlaceholderText(/^patient.relatedPerson$/i)).toBeInTheDocument()
    })

    it('should render a relationship type text input', () => {
      setup()
      const relationshipTypeInput = screen.getByLabelText(
        /^patient.relatedPersons.relationshipType$/i,
      )
      expect(relationshipTypeInput).toBeInTheDocument()
      expect(relationshipTypeInput).not.toBeDisabled()
    })

    it('should render a cancel button', () => {
      setup()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('should render an add new related person button button', () => {
      setup()
      expect(
        screen.getByRole('button', { name: /patient.relatedPersons.add/i }),
      ).toBeInTheDocument()
    })

    it('should render the error when there is an error saving', async () => {
      setup()
      const expectedErrorMessage = 'patient.relatedPersons.error.unableToAddRelatedPerson'
      const expectedError = {
        relatedPersonError: 'patient.relatedPersons.error.relatedPersonRequired',
        relationshipTypeError: 'patient.relatedPersons.error.relationshipTypeRequired',
      }
      expectOneConsoleError(expectedError)

      userEvent.click(screen.getByRole('button', { name: /patient.relatedPersons.add/i }))
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument()
      expect(screen.getByText(/states.error/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/^patient.relatedPerson$/i)).toHaveClass('is-invalid')
      expect(screen.getByLabelText(/^patient.relatedPersons.relationshipType$/i)).toHaveClass(
        'is-invalid',
      )
      expect(screen.getByText(expectedError.relatedPersonError)).toBeInTheDocument()
      expect(screen.getByText(expectedError.relationshipTypeError)).toBeInTheDocument()
    })
  })

  describe('save', () => {
    it('should call the save function with the correct data', async () => {
      setup()
      userEvent.type(screen.getByPlaceholderText(/^patient.relatedPerson$/i), patient2.fullName)
      userEvent.click(await screen.findByText(`${patient.fullName} (${patient.code})`))

      userEvent.type(
        screen.getByLabelText(/^patient.relatedPersons.relationshipType$/i),
        'relationship',
      )
      userEvent.click(screen.getByRole('button', { name: /patient.relatedPersons.add/i }))

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          relatedPersons: [
            expect.objectContaining({
              patientId: '123',
              type: 'relationship',
            }),
          ],
        }),
      )
    })
  })
})
