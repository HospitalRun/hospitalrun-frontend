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

import Email from '../../../model/Email'
import Patient from '../../../model/Patient'
import GeneralInformation from '../../../patients/GeneralInformation'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Error handling', () => {
  it('should display errors', () => {
    const error = {
      message: 'some message',
      givenName: 'given name message',
      email: ['email message'],
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

describe('General Information, without isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    emails: [
      {
        id: '1234',
        email: 'email@email.com',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
    emails: ['email message'],
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

  it('should render the Email Type of the Patient', () => {
    const emailTypeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'permanentEmailType')
    expect(emailTypeSelect.prop('value')).toEqual(patient.emails[0].type)
    expect(emailTypeSelect.prop('label')).toEqual('patient.email.type')
    expect(emailTypeSelect.prop('isEditable')).toBeFalsy()
    expect(emailTypeSelect.prop('options')).toHaveLength(5)
    expect(emailTypeSelect.prop('options')[0].label).toEqual('patient.email.types.home')
    expect(emailTypeSelect.prop('options')[0].value).toEqual('home')
    expect(emailTypeSelect.prop('options')[1].label).toEqual('patient.email.types.work')
    expect(emailTypeSelect.prop('options')[1].value).toEqual('work')
    expect(emailTypeSelect.prop('options')[2].label).toEqual('patient.email.types.temporary')
    expect(emailTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(emailTypeSelect.prop('options')[3].label).toEqual('patient.email.types.old')
    expect(emailTypeSelect.prop('options')[3].value).toEqual('old')
    expect(emailTypeSelect.prop('options')[4].label).toEqual('patient.email.types.mobile')
    expect(emailTypeSelect.prop('options')[4].value).toEqual('mobile')
  })

  it('should render the email of the patient', () => {
    const emailInput = wrapper.findWhere((w: any) => w.prop('name') === 'permanentEmail')
    patient.emails.forEach((email: Email) => {
      expect(emailInput.prop('value')).toEqual(email.email)
    })
    expect(emailInput.prop('label')).toEqual('patient.email.email')
    expect(emailInput.prop('isEditable')).toBeFalsy()
  })
})

describe('Emails, isEditable', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    emails: [
      {
        id: '1234',
        email: 'email@email.com',
        type: 'Home',
      },
    ],
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const error = {
    message: 'some message',
    givenName: 'given name message',
    emails: ['email message'],
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
  const expectedEmailType = 'expectedEmailType'
  const expectedEmail = 'expectedEmail'

  it('should render the Email of the Patient', () => {
    const emailTypeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'permanentEmailType')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(emailTypeSelect.prop('value')).toEqual(patient.emails[0].type)
    expect(emailTypeSelect.prop('label')).toEqual('patient.email.type')
    expect(emailTypeSelect.prop('isEditable')).toBeTruthy()
    expect(emailTypeSelect.prop('options')).toHaveLength(5)
    expect(emailTypeSelect.prop('options')[0].label).toEqual('patient.email.types.home')
    expect(emailTypeSelect.prop('options')[0].value).toEqual('home')
    expect(emailTypeSelect.prop('options')[1].label).toEqual('patient.email.types.work')
    expect(emailTypeSelect.prop('options')[1].value).toEqual('work')
    expect(emailTypeSelect.prop('options')[2].label).toEqual('patient.email.types.temporary')
    expect(emailTypeSelect.prop('options')[2].value).toEqual('temporary')
    expect(emailTypeSelect.prop('options')[3].label).toEqual('patient.email.types.old')
    expect(emailTypeSelect.prop('options')[3].value).toEqual('old')
    expect(emailTypeSelect.prop('options')[4].label).toEqual('patient.email.types.mobile')
    expect(emailTypeSelect.prop('options')[4].value).toEqual('mobile')

    act(() => {
      emailTypeSelect.prop('onChange')({ target: { value: expectedEmailType } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedEmailType,
      'emails',
      'type',
    )

    const emailInput = wrapper.findWhere((w: any) => w.prop('name') === 'permanentEmail')

    patient.emails.forEach((email: Email) => {
      expect(emailInput.prop('value')).toEqual(email.email)
    })
    expect(emailInput.prop('label')).toEqual('patient.email.email')
    expect(emailInput.prop('isEditable')).toBeTruthy()

    act(() => {
      emailInput.prop('onChange')({ target: { value: expectedEmail } })
    })

    expect(generalInformation.prop('onObjectArrayChange')).toHaveBeenCalledWith(
      arrayIndex,
      expectedEmail,
      'emails',
      false,
    )
  })
})
