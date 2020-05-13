// eslint-disable-next-line no-restricted-imports
import '../../../__mocks__/matchMediaMock'

import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from 'clients/db/PatientRepository'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import Patient from 'model/Patient'
import NewAllergyModal from 'patients/allergies/NewAllergyModal'
import * as patientSlice from 'patients/patient-slice'

const mockStore = createMockStore([thunk])

describe('New Allergy Modal', () => {
  const mockPatient = {
    id: '123',
    givenName: 'someName',
  } as Patient

  beforeEach(() => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(mockPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)
  })

  it('should render a modal with the correct labels', () => {
    const store = mockStore({
      patient: {
        patient: {
          id: '123',
        },
      },
    })
    const wrapper = mount(
      <Provider store={store}>
        <NewAllergyModal show onCloseButtonClick={jest.fn()} />
      </Provider>,
    )

    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.allergies.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.allergies.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  it('should display the errors', () => {
    const expectedError = {
      message: 'some error message',
      name: 'some name message',
    }
    const store = mockStore({
      patient: {
        patient: {
          id: '123',
        },
        allergyError: expectedError,
      },
    })
    const wrapper = mount(
      <Provider store={store}>
        <NewAllergyModal show onCloseButtonClick={jest.fn()} />
      </Provider>,
    )
    wrapper.update()

    const alert = wrapper.find(Alert)
    const nameField = wrapper.find(TextInputWithLabelFormGroup)

    expect(alert.prop('title')).toEqual('states.error')
    expect(alert.prop('message')).toEqual(expectedError.message)
    expect(nameField.prop('isInvalid')).toBeTruthy()
    expect(nameField.prop('feedback')).toEqual(expectedError.name)
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const store = mockStore({
        patient: {
          patient: {
            id: '123',
          },
        },
      })
      const wrapper = mount(
        <Provider store={store}>
          <NewAllergyModal show onCloseButtonClick={onCloseButtonClickSpy} />
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

  describe('save', () => {
    it('should dispatch add allergy', () => {
      jest.spyOn(patientSlice, 'addAllergy')
      const expectedName = 'expected name'
      const patient = {
        id: '123',
      }
      const store = mockStore({
        patient: {
          patient,
        },
      })
      const wrapper = mount(
        <Provider store={store}>
          <NewAllergyModal show onCloseButtonClick={jest.fn()} />
        </Provider>,
      )
      wrapper.update()

      act(() => {
        const input = wrapper.findWhere((c) => c.prop('name') === 'name')
        const onChange = input.prop('onChange')
        onChange({ target: { value: expectedName } })
      })

      wrapper.update()

      act(() => {
        const modal = wrapper.find(Modal)
        const onSave = (modal.prop('successButton') as any).onClick
        onSave({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(patientSlice.addAllergy).toHaveBeenCalledWith(patient.id, { name: expectedName })
    })
  })
})
