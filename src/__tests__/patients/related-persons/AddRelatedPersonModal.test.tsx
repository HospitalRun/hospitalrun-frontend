import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { ReactWrapper, mount } from 'enzyme'
import { Modal, Alert, Typeahead } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureMockStore, { MockStore } from 'redux-mock-store'
import Patient from 'model/Patient'
import TextInputWithLabelFormGroup from '../../../components/input/TextInputWithLabelFormGroup'
import AddRelatedPersonModal from '../../../patients/related-persons/AddRelatedPersonModal'
import * as patientSlice from '../../../patients/patient-slice'
import PatientRepository from '../../../clients/db/PatientRepository'

const mockStore = configureMockStore([thunk])

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

  let store: MockStore

  describe('layout', () => {
    let wrapper: ReactWrapper

    store = mockStore({
      patient: { patient },
    })
    beforeEach(() => {
      jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

      wrapper = mount(
        <Provider store={store}>
          <AddRelatedPersonModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
        </Provider>,
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
      const cancelButton = wrapper.findWhere(
        (w: { text: () => string }) => w.text() === 'actions.cancel',
      )

      expect(cancelButton).toHaveLength(1)
    })

    it('should render an add new related person button button', () => {
      const modal = wrapper.find(Modal) as any
      expect(modal.prop('successButton').children).toEqual('patient.relatedPersons.add')
    })

    it('should render the error', () => {
      const expectedError = {
        message: 'some message',
        relatedPerson: 'some related person error',
        relationshipType: 'some relationship type error',
      }
      store = mockStore({
        patient: {
          patient,
          relatedPersonError: expectedError,
        },
      })
      wrapper = mount(
        <Provider store={store}>
          <AddRelatedPersonModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
        </Provider>,
      )

      const alert = wrapper.find(Alert)
      const typeahead = wrapper.find(Typeahead)
      const relationshipTypeInput = wrapper.find(TextInputWithLabelFormGroup)

      expect(alert.prop('message')).toEqual(expectedError.message)
      expect(alert.prop('title')).toEqual('states.error')
      expect(typeahead.prop('isInvalid')).toBeTruthy()
      expect(relationshipTypeInput.prop('isInvalid')).toBeTruthy()
      expect(relationshipTypeInput.prop('feedback')).toEqual(expectedError.relationshipType)
    })
  })

  describe('save', () => {
    jest.spyOn(patientSlice, 'addRelatedPerson')
    let wrapper: ReactWrapper
    store = mockStore({
      patient: {
        patient,
      },
    })
    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <AddRelatedPersonModal show onCloseButtonClick={jest.fn()} toggle={jest.fn()} />
        </Provider>,
      )
    })

    it('should call the save function with the correct data', () => {
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

      act(() => {
        const { onClick } = wrapper.find(Modal).prop('successButton') as any
        onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>)
      })

      expect(patientSlice.addRelatedPerson).toHaveBeenCalledWith(patient.id, {
        patientId: '123',
        type: 'relationship',
      })
    })
  })
})
