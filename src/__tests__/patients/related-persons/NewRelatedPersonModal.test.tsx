import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { ReactWrapper, mount } from 'enzyme'
import { Modal, Button, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import NewRelatedPersonModal from '../../../patients/related-persons/NewRelatedPersonModal'
import TextInputWithLabelFormGroup from '../../../components/input/TextInputWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../../components/input/TextFieldWithLabelFormGroup'

describe('New Related Person Modal', () => {
  describe('layout', () => {
    let wrapper: ReactWrapper
    beforeEach(() => {
      wrapper = mount(
        <NewRelatedPersonModal
          show
          onSave={jest.fn()}
          onCloseButtonClick={jest.fn()}
          toggle={jest.fn()}
        />,
      )
    })

    it('should render a modal', () => {
      const modal = wrapper.find(Modal)
      expect(modal).toHaveLength(1)
      expect(modal.prop('show')).toBeTruthy()
    })

    it('should render a prefix name text input', () => {
      const prefixTextInput = wrapper.findWhere((w) => w.prop('name') === 'prefix')

      expect(prefixTextInput).toHaveLength(1)
      expect(prefixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(prefixTextInput.prop('name')).toEqual('prefix')
      expect(prefixTextInput.prop('isEditable')).toBeTruthy()
      expect(prefixTextInput.prop('label')).toEqual('patient.prefix')
    })

    it('should render a given name text input', () => {
      const givenNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'givenName')

      expect(givenNameTextInput).toHaveLength(1)
      expect(givenNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(givenNameTextInput.prop('name')).toEqual('givenName')
      expect(givenNameTextInput.prop('isEditable')).toBeTruthy()
      expect(givenNameTextInput.prop('label')).toEqual('patient.givenName')
    })

    it('should render a family name text input', () => {
      const familyNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'familyName')

      expect(familyNameTextInput).toHaveLength(1)
      expect(familyNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(familyNameTextInput.prop('name')).toEqual('familyName')
      expect(familyNameTextInput.prop('isEditable')).toBeTruthy()
      expect(familyNameTextInput.prop('label')).toEqual('patient.familyName')
    })

    it('should render a suffix text input', () => {
      const suffixTextInput = wrapper.findWhere((w) => w.prop('name') === 'suffix')

      expect(suffixTextInput).toHaveLength(1)
      expect(suffixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(suffixTextInput.prop('name')).toEqual('suffix')
      expect(suffixTextInput.prop('isEditable')).toBeTruthy()
      expect(suffixTextInput.prop('label')).toEqual('patient.suffix')
    })

    it('should render a relationship type text input', () => {
      const relationshipTypeTextInput = wrapper.findWhere((w) => w.prop('name') === 'type')

      expect(relationshipTypeTextInput).toHaveLength(1)
      expect(relationshipTypeTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(relationshipTypeTextInput.prop('name')).toEqual('type')
      expect(relationshipTypeTextInput.prop('isEditable')).toBeTruthy()
      expect(relationshipTypeTextInput.prop('label')).toEqual(
        'patient.relatedPersons.relationshipType',
      )
    })

    it('should render a phone number text input', () => {
      const phoneNumberTextInput = wrapper.findWhere((w) => w.prop('name') === 'phoneNumber')

      expect(phoneNumberTextInput).toHaveLength(1)
      expect(phoneNumberTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(phoneNumberTextInput.prop('name')).toEqual('phoneNumber')
      expect(phoneNumberTextInput.prop('isEditable')).toBeTruthy()
      expect(phoneNumberTextInput.prop('label')).toEqual('patient.phoneNumber')
    })

    it('should render a email text input', () => {
      const emailTextInput = wrapper.findWhere((w) => w.prop('name') === 'email')

      expect(emailTextInput).toHaveLength(1)
      expect(emailTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(emailTextInput.prop('name')).toEqual('email')
      expect(emailTextInput.prop('isEditable')).toBeTruthy()
      expect(emailTextInput.prop('label')).toEqual('patient.email')
    })

    it('should render a address text input', () => {
      const addressTextField = wrapper.findWhere((w) => w.prop('name') === 'address')

      expect(addressTextField).toHaveLength(1)
      expect(addressTextField.type()).toBe(TextFieldWithLabelFormGroup)
      expect(addressTextField.prop('name')).toEqual('address')
      expect(addressTextField.prop('isEditable')).toBeTruthy()
      expect(addressTextField.prop('label')).toEqual('patient.address')
    })

    it('should render a cancel button', () => {
      const cancelButton = wrapper.findWhere((w) => w.text() === 'actions.cancel')

      expect(cancelButton).toHaveLength(1)
    })

    it('should render an add new related person button button', () => {
      const modal = wrapper.find(Modal)
      expect(modal.prop('successButton').children).toEqual('patient.relatedPersons.new')
    })
  })

  describe('save', () => {
    let wrapper: ReactWrapper
    let onSaveSpy = jest.fn()
    beforeEach(() => {
      onSaveSpy = jest.fn()
      wrapper = mount(
        <NewRelatedPersonModal
          show
          onSave={onSaveSpy}
          onCloseButtonClick={jest.fn()}
          toggle={jest.fn()}
        />,
      )
    })

    it('should call the save function with the correct data', () => {
      act(() => {
        const prefixTextInput = wrapper.findWhere((w) => w.prop('name') === 'prefix')
        prefixTextInput.prop('onChange')({ target: { value: 'prefix' } })
      })
      wrapper.update()

      act(() => {
        const givenNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'givenName')
        givenNameTextInput.prop('onChange')({ target: { value: 'given' } })
      })
      wrapper.update()

      act(() => {
        const familyNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'familyName')
        familyNameTextInput.prop('onChange')({ target: { value: 'family' } })
      })
      wrapper.update()

      act(() => {
        const suffixTextInput = wrapper.findWhere((w) => w.prop('name') === 'suffix')
        suffixTextInput.prop('onChange')({ target: { value: 'suffix' } })
      })
      wrapper.update()

      act(() => {
        const relationshipTypeTextInput = wrapper.findWhere((w) => w.prop('name') === 'type')
        relationshipTypeTextInput.prop('onChange')({ target: { value: 'relationship' } })
      })
      wrapper.update()

      act(() => {
        const phoneNumberTextInput = wrapper.findWhere((w) => w.prop('name') === 'phoneNumber')
        phoneNumberTextInput.prop('onChange')({ target: { value: 'phone number' } })
      })
      wrapper.update()

      act(() => {
        const emailTextInput = wrapper.findWhere((w) => w.prop('name') === 'email')
        emailTextInput.prop('onChange')({ target: { value: 'email' } })
      })
      wrapper.update()

      act(() => {
        const addressTextField = wrapper.findWhere((w) => w.prop('name') === 'address')
        addressTextField.prop('onChange')({ currentTarget: { value: 'address' } })
      })
      wrapper.update()

      const addNewButton = wrapper.findWhere((w) => w.text() === 'patient.relatedPersons.new')
      act(() => {
        wrapper
          .find(Modal)
          .prop('successButton')
          .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>)
      })

      expect(onSaveSpy).toHaveBeenCalledTimes(1)
      expect(onSaveSpy).toHaveBeenCalledWith({
        prefix: 'prefix',
        givenName: 'given',
        familyName: 'family',
        suffix: 'suffix',
        type: 'relationship',
        phoneNumber: 'phone number',
        email: 'email',
        address: 'address',
      })
    })

    it('should display an error message if given name or relationship type is not entered.', () => {
      act(() => {
        wrapper
          .find(Modal)
          .prop('successButton')
          .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>)
      })

      wrapper.update()

      const errorAlert = wrapper.find(Alert)
      expect(onSaveSpy).not.toHaveBeenCalled()
      expect(errorAlert).toHaveLength(1)
      expect(errorAlert.prop('message')).toEqual(
        'patient.relatedPersons.error.givenNameRequired patient.relatedPersons.error.relationshipTypeRequired',
      )
    })
  })
})
