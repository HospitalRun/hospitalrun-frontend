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

import Address from '../../../model/Address'
import Patient from '../../../model/Patient'
import GeneralInformation from '../../../patients/GeneralInformation'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Error handling', () => {
  it('should display errors', () => {
    const error = {
      message: 'some message',
      givenName: 'given name message',
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

describe('Addresses, without isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    addresses: [
      {
        id: '1234',
        address: 'address',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
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

  it('should render the Address Type of the Patient', () => {
    const addressTypeSelect = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentAddressType',
    )
    expect(addressTypeSelect.prop('value')).toEqual(patient.addresses[0].type)
    expect(addressTypeSelect.prop('label')).toEqual('patient.address.type')
    expect(addressTypeSelect.prop('isEditable')).toBeFalsy()
    expect(addressTypeSelect.prop('options')).toHaveLength(5)
    expect(addressTypeSelect.prop('options')[0].label).toEqual('patient.address.types.home')
    expect(addressTypeSelect.prop('options')[0].value).toEqual('home')
    expect(addressTypeSelect.prop('options')[1].label).toEqual('patient.address.types.work')
    expect(addressTypeSelect.prop('options')[1].value).toEqual('work')
    expect(addressTypeSelect.prop('options')[2].label).toEqual('patient.address.types.temporary')
    expect(addressTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(addressTypeSelect.prop('options')[3].label).toEqual('patient.address.types.old')
    expect(addressTypeSelect.prop('options')[3].value).toEqual('old')
    expect(addressTypeSelect.prop('options')[4].label).toEqual('patient.address.types.billing')
    expect(addressTypeSelect.prop('options')[4].value).toEqual('billing')
  })

  it('should render the address of the patient', () => {
    const addressInput = wrapper.findWhere((w: any) => w.prop('name') === 'permanentAddress')
    patient.addresses.forEach((address: Address) => {
      expect(addressInput.prop('value')).toEqual(address.address)
    })
    expect(addressInput.prop('label')).toEqual('patient.address.address')
    expect(addressInput.prop('isEditable')).toBeFalsy()
  })
})

describe('Addresses, isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    addresses: [
      {
        id: '1234',
        address: 'address',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
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
  const expectedAddressType = 'expectedAddressType'
  const expectedAddress = 'expectedAddress'

  it('should render the Address Type of the Patient', () => {
    const addressTypeSelect = wrapper.findWhere(
      (w: any) => w.prop('name') === 'permanentAddressType',
    )
    const generalInformation = wrapper.find(GeneralInformation)

    expect(addressTypeSelect.prop('value')).toEqual(patient.addresses[0].type)
    expect(addressTypeSelect.prop('label')).toEqual('patient.address.type')
    expect(addressTypeSelect.prop('isEditable')).toBeTruthy()
    expect(addressTypeSelect.prop('options')).toHaveLength(5)
    expect(addressTypeSelect.prop('options')[0].label).toEqual('patient.address.types.home')
    expect(addressTypeSelect.prop('options')[0].value).toEqual('home')
    expect(addressTypeSelect.prop('options')[1].label).toEqual('patient.address.types.work')
    expect(addressTypeSelect.prop('options')[1].value).toEqual('work')
    expect(addressTypeSelect.prop('options')[2].label).toEqual('patient.address.types.temporary')
    expect(addressTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(addressTypeSelect.prop('options')[3].label).toEqual('patient.address.types.old')
    expect(addressTypeSelect.prop('options')[3].value).toEqual('old')
    expect(addressTypeSelect.prop('options')[4].label).toEqual('patient.address.types.billing')
    expect(addressTypeSelect.prop('options')[4].value).toEqual('billing')

    act(() => {
      addressTypeSelect.prop('onChange')({ target: { value: expectedAddressType } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedAddressType,
      'addresses',
      'type',
    )

    const addressInput = wrapper.findWhere((w: any) => w.prop('name') === 'permanentAddress')

    patient.addresses.forEach((address: Address) => {
      expect(addressInput.prop('value')).toEqual(address.address)
    })
    expect(addressInput.prop('label')).toEqual('patient.address.address')
    expect(addressInput.prop('isEditable')).toBeTruthy()

    act(() => {
      addressInput.prop('onChange')({ target: { value: expectedAddress } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedAddress,
      'addresses',
      false,
    )
  })
})
