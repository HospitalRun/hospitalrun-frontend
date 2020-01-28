import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { ReactWrapper, mount } from 'enzyme'
import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { Typeahead } from 'react-bootstrap-typeahead'
import NewRelatedPersonModal from '../../../patients/related-persons/NewRelatedPersonModal'
import TextInputWithLabelFormGroup from '../../../components/input/TextInputWithLabelFormGroup'

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

    it('should render a patient search typeahead', () => {
      const patientSearchTypeahead = wrapper.find(Typeahead)

      expect(patientSearchTypeahead).toHaveLength(1)
      expect(patientSearchTypeahead.prop('placeholder')).toEqual('patient.relatedPerson')
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
        const patientTypeahead = wrapper.find(Typeahead)
        patientTypeahead.prop('onChange')([{ id: '123' }])
      })
      wrapper.update()

      act(() => {
        const relationshipTypeTextInput = wrapper.findWhere((w) => w.prop('name') === 'type')
        relationshipTypeTextInput.prop('onChange')({ target: { value: 'relationship' } })
      })
      wrapper.update()

      const addNewButton = wrapper.findWhere((w) => w.text() === 'patient.relatedPersons.new')
      act(() => {
        ;(wrapper.find(Modal).prop('successButton') as any).onClick(
          {} as React.MouseEvent<HTMLButtonElement, MouseEvent>,
        )
      })
      expect(onSaveSpy).toHaveBeenCalledTimes(1)
      expect(onSaveSpy).toHaveBeenCalledWith({
        patientId: '123',
        type: 'relationship',
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
        'patient.relatedPersons.error.relatedPersonRequired patient.relatedPersons.error.relationshipTypeRequired',
      )
    })
  })
})
