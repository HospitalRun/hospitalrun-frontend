import '../../../__mocks__/matchMediaMock'

import { Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Patient from '../../../model/Patient'
import PhoneNumber from '../../../model/PhoneNumber'
import GeneralInformation from '../../../patients/GeneralInformation'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Error handling', () => {
  it('should display errors', () => {
    const error = {
      message: 'some message',
      givenName: 'given name message',
      phoneNumber: ['phone number message'],
    }

    const store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)
    const wrapper = mount(
      <Provider store={store}>
        <GeneralInformation patient={{} as Patient} isEditable error={error} />
      </Provider>,
    )
    wrapper.update()

    const errorMessage = wrapper.find(Alert)

    expect(errorMessage).toBeTruthy()
  })
})

describe('Phone Numbers, without isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    phoneNumbers: [
      {
        id: '1234',
        phoneNumber: 'phoneNumber',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
    phoneNumbers: ['phone number message'],
  }

  const store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)

  beforeEach(() => {
    Date.now = jest.fn().mockReturnValue(new Date().valueOf())
    jest.restoreAllMocks()
    history = createMemoryHistory()
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <GeneralInformation patient={patient} />)
        </Router>
      </Provider>,
    )
  })

  it('should render the Phone Number Type of the Patient', () => {
    const phoneNumberTypeSelect = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentPhoneNumberType',
    )
    expect(phoneNumberTypeSelect.prop('value')).toEqual(patient.phoneNumbers[0].type)
    expect(phoneNumberTypeSelect.prop('label')).toEqual('patient.phoneNumber.type')
    expect(phoneNumberTypeSelect.prop('isEditable')).toBeFalsy()
    expect(phoneNumberTypeSelect.prop('options')).toHaveLength(5)
    expect(phoneNumberTypeSelect.prop('options')[0].label).toEqual('patient.phoneNumber.types.home')
    expect(phoneNumberTypeSelect.prop('options')[0].value).toEqual('home')
    expect(phoneNumberTypeSelect.prop('options')[1].label).toEqual('patient.phoneNumber.types.work')
    expect(phoneNumberTypeSelect.prop('options')[1].value).toEqual('work')
    expect(phoneNumberTypeSelect.prop('options')[2].label).toEqual(
      'patient.phoneNumber.types.temporary',
    )
    expect(phoneNumberTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(phoneNumberTypeSelect.prop('options')[3].label).toEqual('patient.phoneNumber.types.old')
    expect(phoneNumberTypeSelect.prop('options')[3].value).toEqual('old')
    expect(phoneNumberTypeSelect.prop('options')[4].label).toEqual(
      'patient.phoneNumber.types.mobile',
    )
    expect(phoneNumberTypeSelect.prop('options')[4].value).toEqual('mobile')
  })

  it('should render the Phone Number of the patient', () => {
    const phoneNumberInput = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentPhoneNumber',
    )
    patient.phoneNumbers.forEach((phone: PhoneNumber) => {
      expect(phoneNumberInput.prop('value')).toEqual(phone.phoneNumber)
    })
    expect(phoneNumberInput.prop('label')).toEqual('patient.phoneNumber.phoneNumber')
    expect(phoneNumberInput.prop('isEditable')).toBeFalsy()
  })
})

describe('Phone Numbers, isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    phoneNumbers: [
      {
        id: '1234',
        phoneNumber: 'phoneNumber',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
    phoneNumbers: ['phone number message'],
  }

  const store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)

  const onFieldChange = jest.fn()

  beforeEach(() => {
    jest.restoreAllMocks()
    Date.now = jest.fn().mockReturnValue(new Date().valueOf())
    history = createMemoryHistory()
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <GeneralInformation
            patient={patient}
            onFieldChange={onFieldChange}
            onObjectArrayChange={jest.fn()}
            addEmptyEntryToPatientArrayField={jest.fn()}
            isEditable
          />
          )
        </Router>
      </Provider>,
    )
  })

  const arrayIndex = 0
  const expectedPhoneNumberType = 'expectedPhoneNumberType'
  const expectedPhoneNumber = 'expectedPhoneNumber'

  it('should render the Phone Number of the Patient', () => {
    const phoneNumberTypeSelect = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentPhoneNumberType',
    )
    const generalInformation = wrapper.find(GeneralInformation)

    expect(phoneNumberTypeSelect.prop('value')).toEqual(patient.phoneNumbers[0].type)
    expect(phoneNumberTypeSelect.prop('label')).toEqual('patient.phoneNumber.type')
    expect(phoneNumberTypeSelect.prop('isEditable')).toBeTruthy()
    expect(phoneNumberTypeSelect.prop('options')).toHaveLength(5)
    expect(phoneNumberTypeSelect.prop('options')[0].label).toEqual('patient.phoneNumber.types.home')
    expect(phoneNumberTypeSelect.prop('options')[0].value).toEqual('home')
    expect(phoneNumberTypeSelect.prop('options')[1].label).toEqual('patient.phoneNumber.types.work')
    expect(phoneNumberTypeSelect.prop('options')[1].value).toEqual('work')
    expect(phoneNumberTypeSelect.prop('options')[2].label).toEqual(
      'patient.phoneNumber.types.temporary',
    )
    expect(phoneNumberTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(phoneNumberTypeSelect.prop('options')[3].label).toEqual('patient.phoneNumber.types.old')
    expect(phoneNumberTypeSelect.prop('options')[3].value).toEqual('old')
    expect(phoneNumberTypeSelect.prop('options')[4].label).toEqual(
      'patient.phoneNumber.types.mobile',
    )
    expect(phoneNumberTypeSelect.prop('options')[4].value).toEqual('mobile')

    act(() => {
      phoneNumberTypeSelect.prop('onChange')({ target: { value: expectedPhoneNumberType } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedPhoneNumberType,
      'phoneNumbers',
      'type',
    )

    const phoneNumberInput = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentPhoneNumber',
    )

    patient.phoneNumbers.forEach((phone: PhoneNumber) => {
      expect(phoneNumberInput.prop('value')).toEqual(phone.phoneNumber)
    })
    expect(phoneNumberInput.prop('label')).toEqual('patient.phoneNumber.phoneNumber')
    expect(phoneNumberInput.prop('isEditable')).toBeTruthy()

    act(() => {
      phoneNumberInput.prop('onChange')({ target: { value: expectedPhoneNumber } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedPhoneNumber,
      'phoneNumbers',
      false,
    )
  })
})
