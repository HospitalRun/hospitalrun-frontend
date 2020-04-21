import '../../../__mocks__/matchMediaMock'
import React from 'react'
import NewNoteModal from 'patients/notes/NewNoteModal'
import { shallow, mount } from 'enzyme'
import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'

describe('New Note Modal', () => {
  it('should render a modal with the correct labels', () => {
    const wrapper = shallow(
      <NewNoteModal show onCloseButtonClick={jest.fn()} onSave={jest.fn()} toggle={jest.fn()} />,
    )

    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.notes.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.notes.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  it('should render a notes rich text editor', () => {
    const wrapper = mount(
      <NewNoteModal show onCloseButtonClick={jest.fn()} onSave={jest.fn()} toggle={jest.fn()} />,
    )

    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)
    expect(noteTextField.prop('label')).toEqual('patient.note')
    expect(noteTextField.prop('isRequired')).toBeTruthy()
    expect(noteTextField).toHaveLength(1)
  })

  describe('on cancel', () => {
    it('should call the onCloseButtonCLick function when the cancel button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const wrapper = shallow(
        <NewNoteModal
          show
          onCloseButtonClick={onCloseButtonClickSpy}
          onSave={jest.fn()}
          toggle={jest.fn()}
        />,
      )

      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('closeButton') as any
        onClick()
      })

      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('on save', () => {
    const expectedDate = new Date()
    const expectedNote = 'test'

    Date.now = jest.fn(() => expectedDate.valueOf())
    it('should call the onSave callback', () => {
      const onSaveSpy = jest.fn()
      const wrapper = mount(
        <NewNoteModal show onCloseButtonClick={jest.fn()} onSave={onSaveSpy} toggle={jest.fn()} />,
      )

      act(() => {
        const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)
        const onChange = noteTextField.prop('onChange') as any
        onChange({ currentTarget: { value: expectedNote } })
      })

      wrapper.update()
      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('successButton') as any
        onClick()
      })

      expect(onSaveSpy).toHaveBeenCalledTimes(1)
      expect(onSaveSpy).toHaveBeenCalledWith({
        text: expectedNote,
        date: expectedDate.toISOString(),
      })
    })

    it('should require a note be added', async () => {
      const onSaveSpy = jest.fn()
      const wrapper = mount(
        <NewNoteModal show onCloseButtonClick={jest.fn()} onSave={onSaveSpy} toggle={jest.fn()} />,
      )

      await act(async () => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('successButton') as any
        await onClick()
      })
      wrapper.update()

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)
      const errorAlert = wrapper.find(Alert)

      expect(errorAlert).toHaveLength(1)
      expect(errorAlert.prop('title')).toEqual('states.error')
      expect(errorAlert.prop('message')).toEqual('patient.notes.error.unableToAdd')
      expect(notesTextField.prop('feedback')).toEqual('patient.notes.error.noteRequired')
      expect(onSaveSpy).not.toHaveBeenCalled()
    })
  })
})
