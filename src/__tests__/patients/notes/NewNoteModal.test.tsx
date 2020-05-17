import '../../../__mocks__/matchMediaMock'

import { Alert, Modal } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import TextFieldWithLabelFormGroup from '../../../components/input/TextFieldWithLabelFormGroup'
import Patient from '../../../model/Patient'
import NewNoteModal from '../../../patients/notes/NewNoteModal'
import * as patientSlice from '../../../patients/patient-slice'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Note Modal', () => {
  beforeEach(() => {
    jest.spyOn(PatientRepository, 'find')
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  it('should render a modal with the correct labels', () => {
    const expectedPatient = {
      id: '1234',
      givenName: 'some name',
    }
    const store = mockStore({
      patient: {
        patient: expectedPatient,
      },
    } as any)
    const wrapper = mount(
      <Provider store={store}>
        <NewNoteModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
      </Provider>,
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
    const expectedPatient = {
      id: '1234',
      givenName: 'some name',
    }
    const store = mockStore({
      patient: {
        patient: expectedPatient,
      },
    } as any)
    const wrapper = mount(
      <Provider store={store}>
        <NewNoteModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
      </Provider>,
    )

    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)
    expect(noteTextField.prop('label')).toEqual('patient.note')
    expect(noteTextField.prop('isRequired')).toBeTruthy()
    expect(noteTextField).toHaveLength(1)
  })

  it('should render note error', () => {
    const expectedPatient = {
      id: '1234',
      givenName: 'some name',
    }
    const expectedError = {
      message: 'some message',
      note: 'some note error',
    }
    const store = mockStore({
      patient: {
        patient: expectedPatient,
        noteError: expectedError,
      },
    } as any)
    const wrapper = mount(
      <Provider store={store}>
        <NewNoteModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
      </Provider>,
    )

    const alert = wrapper.find(Alert)
    const noteTextField = wrapper.find(TextFieldWithLabelFormGroup)
    expect(alert.prop('title')).toEqual('states.error')
    expect(alert.prop('message')).toEqual(expectedError.message)
    expect(noteTextField.prop('isInvalid')).toBeTruthy()
    expect(noteTextField.prop('feedback')).toEqual(expectedError.note)
  })

  describe('on cancel', () => {
    it('should call the onCloseButtonCLick function when the cancel button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const expectedPatient = {
        id: '1234',
        givenName: 'some name',
      }
      const store = mockStore({
        patient: {
          patient: expectedPatient,
        },
      } as any)
      const wrapper = mount(
        <Provider store={store}>
          <NewNoteModal show onCloseButtonClick={onCloseButtonClickSpy} toggle={jest.fn()} />
        </Provider>,
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
    it('should dispatch add note', () => {
      const expectedNote = 'some note'
      jest.spyOn(patientSlice, 'addNote')
      const expectedPatient = {
        id: '1234',
        givenName: 'some name',
      }
      const store = mockStore({
        patient: {
          patient: expectedPatient,
        },
      } as any)

      jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient as Patient)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient as Patient)

      const wrapper = mount(
        <Provider store={store}>
          <NewNoteModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
        </Provider>,
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

      expect(patientSlice.addNote).toHaveBeenCalledWith(expectedPatient.id, { text: expectedNote })
    })
  })
})
