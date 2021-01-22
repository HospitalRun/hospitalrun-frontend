/* eslint-disable no-console */

import { Alert, Modal } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'

import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import Note from '../../../shared/model/Note'
import NewNoteModal from '../../../shared/notes/NewNoteModal'

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
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedSaveDate.valueOf())
    const wrapper = mount(
      <NewNoteModal
        show
        onCloseButtonClick={onCloseSpy}
        toggle={jest.fn()}
        onSave={onSaveSpy}
        setNote={jest.fn()}
        note={note}
      />,
    )
    return { wrapper }
  }

  beforeEach(() => {
    jest.restoreAllMocks()
    console.error = jest.fn()
  })

  it('should render a new modal with the correct labels', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.notes.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.notes.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  it("should render 'Edit Note' strings if date object is specfiied", () => {
    const { wrapper } = setup(jest.fn(), jest.fn(), {
      ...mockNote,
      date: new Date().toISOString()
    })
    const modal = wrapper.find(Modal)
    expect(modal.prop('title')).toEqual('patient.notes.edit')
    expect(modal.prop('successButton')?.children).toEqual('patient.notes.edit')

  })

  it('should render a notes rich text editor', () => {
    const { wrapper } = setup()

    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)
    expect(noteTextField.prop('label')).toEqual('patient.note')
    expect(noteTextField.prop('isRequired')).toBeTruthy()
    expect(noteTextField).toHaveLength(1)
  })

  it('should render note error', async () => {
    const expectedError = {
      message: 'patient.notes.error.unableToAdd',
      note: 'patient.notes.error.noteRequired',
    }
    const { wrapper } = setup(jest.fn(), jest.fn(), noTextNote)

    await act(async () => {
      const modal = wrapper.find(Modal)
      const onSave = (modal.prop('successButton') as any).onClick
      await onSave({} as React.MouseEvent<HTMLButtonElement>)
    })
    wrapper.update()
    const alert = wrapper.find(Alert)
    expect(alert).toHaveLength(1)
    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)

    expect(alert.prop('title')).toEqual('states.error')
    expect(alert.prop('message')).toEqual(expectedError.message)
    expect(noteTextField.prop('isInvalid')).toBeTruthy()
    expect(noteTextField.prop('feedback')).toEqual(expectedError.note)
  })

  describe('on cancel', () => {
    it('should call the onCloseButtonClick function when the cancel button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const { wrapper } = setup(onCloseButtonClickSpy)

      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('closeButton') as any
        onClick()
      })

      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should dispatch add note', async () => {
    const expectedNote = 'some note'
    const onSaveSpy = jest.fn()
    const { wrapper } = setup(jest.fn(), onSaveSpy)
    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)

    await act(async () => {
      const onChange = noteTextField.prop('onChange') as any
      await onChange({ currentTarget: { value: expectedNote } })
    })

    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const onSave = (modal.prop('successButton') as any).onClick
      await onSave({} as React.MouseEvent<HTMLButtonElement>)
      wrapper.update()
    })

    expect(onSaveSpy).toHaveBeenCalledTimes(1)
    expect(onSaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        date: expectedSaveDate.toISOString(),
      }),
    )

  })
})
