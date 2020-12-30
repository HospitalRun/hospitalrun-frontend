import { Modal, Alert, Typeahead } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'

import AddRelatedPersonModal from '../../../patients/related-persons/AddRelatedPersonModal'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { expectOneConsoleError } from '../../test-utils/console.utils'

describe('Add Related Person Modal', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

    return mount(
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
      const wrapper = setup()
      const modal = wrapper.find(Modal)
      expect(modal).toHaveLength(1)
      expect(modal.prop('show')).toBeTruthy()
    })

    it('should render a patient search typeahead', () => {
      const wrapper = setup()
      const patientSearchTypeahead = wrapper.find(Typeahead)

      expect(patientSearchTypeahead).toHaveLength(1)
      expect(patientSearchTypeahead.prop('placeholder')).toEqual('patient.relatedPerson')
    })

    it('should render a relationship type text input', () => {
      const wrapper = setup()
      const relationshipTypeTextInput = wrapper.findWhere((w: any) => w.prop('name') === 'type')

      expect(relationshipTypeTextInput).toHaveLength(1)
      expect(relationshipTypeTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(relationshipTypeTextInput.prop('name')).toEqual('type')
      expect(relationshipTypeTextInput.prop('isEditable')).toBeTruthy()
      expect(relationshipTypeTextInput.prop('label')).toEqual(
        'patient.relatedPersons.relationshipType',
      )
    })

    it('should render a cancel button', () => {
      const wrapper = setup()
      const cancelButton = wrapper.findWhere(
        (w: { text: () => string }) => w.text() === 'actions.cancel',
      )

      expect(cancelButton).toHaveLength(1)
    })

    it('should render an add new related person button button', () => {
      const wrapper = setup()
      const modal = wrapper.find(Modal) as any
      expect(modal.prop('successButton').children).toEqual('patient.relatedPersons.add')
    })

    it('should render the error when there is an error saving', async () => {
      const wrapper = setup()
      const expectedErrorMessage = 'patient.relatedPersons.error.unableToAddRelatedPerson'
      const expectedError = {
        relatedPersonError: 'patient.relatedPersons.error.relatedPersonRequired',
        relationshipTypeError: 'patient.relatedPersons.error.relationshipTypeRequired',
      }
      expectOneConsoleError(expectedError)

      await act(async () => {
        const modal = wrapper.find(Modal)
        const onSave = (modal.prop('successButton') as any).onClick
        await onSave({} as React.MouseEvent<HTMLButtonElement>)
      })
      wrapper.update()

      const alert = wrapper.find(Alert)
      const typeahead = wrapper.find(Typeahead)
      const relationshipTypeInput = wrapper.find(TextInputWithLabelFormGroup)

      expect(alert.prop('message')).toEqual(expectedErrorMessage)
      expect(alert.prop('title')).toEqual('states.error')
      expect(typeahead.prop('isInvalid')).toBeTruthy()
      expect(relationshipTypeInput.prop('isInvalid')).toBeTruthy()
      expect(relationshipTypeInput.prop('feedback')).toEqual(expectedError.relationshipTypeError)
    })
  })

  describe('save', () => {
    it('should call the save function with the correct data', async () => {
      const wrapper = setup()
      act(() => {
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: '123' }])
      })
      wrapper.update()

      act(() => {
        const relationshipTypeTextInput = wrapper.findWhere((w: any) => w.prop('name') === 'type')
        relationshipTypeTextInput.prop('onChange')({ target: { value: 'relationship' } })
      })
      wrapper.update()

      await act(async () => {
        const { onClick } = wrapper.find(Modal).prop('successButton') as any
        await onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>)
      })

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
