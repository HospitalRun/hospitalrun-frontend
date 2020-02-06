import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { mount, ReactWrapper } from 'enzyme'
import { act } from 'react-dom/test-utils'
import GeneralInformation from 'patients/GeneralInformation'
import { createMemoryHistory } from 'history'
import Patient from '../../model/Patient'

describe('General Information', () => {
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
    friendlyId: 'P00001',
    dateOfBirth: new Date().toISOString(),
    isApproximateDateOfBirth: false,
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  beforeEach(() => {
    history = createMemoryHistory()
    wrapper = mount(
      <Router history={history}>
        <GeneralInformation patient={patient} />)
      </Router>,
    )
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the sex select', () => {
    const sexSelect = wrapper.findWhere((w: any) => w.prop('name') === 'sex')
    expect(sexSelect.prop('value')).toEqual(patient.sex)
    expect(sexSelect.prop('label')).toEqual('patient.sex')
    expect(sexSelect.prop('isEditable')).toBeFalsy()
  })

  it('should render the patient type select', () => {
    const typeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'type')
    expect(typeSelect.prop('value')).toEqual(patient.type)
    expect(typeSelect.prop('label')).toEqual('patient.type')
    expect(typeSelect.prop('isEditable')).toBeFalsy()
  })

  it('should render the date of the birth of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'dateOfBirth')
    expect(dateOfBirthInput.prop('value')).toEqual(new Date(patient.dateOfBirth))
    expect(dateOfBirthInput.prop('label')).toEqual('patient.dateOfBirth')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the occupation of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'occupation')
    expect(dateOfBirthInput.prop('value')).toEqual(patient.occupation)
    expect(dateOfBirthInput.prop('label')).toEqual('patient.occupation')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the preferred language of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'preferredLanguage')
    expect(dateOfBirthInput.prop('value')).toEqual(patient.preferredLanguage)
    expect(dateOfBirthInput.prop('label')).toEqual('patient.preferredLanguage')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the phone number of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'phoneNumber')
    expect(dateOfBirthInput.prop('value')).toEqual(patient.phoneNumber)
    expect(dateOfBirthInput.prop('label')).toEqual('patient.phoneNumber')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the email of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'email')
    expect(dateOfBirthInput.prop('value')).toEqual(patient.email)
    expect(dateOfBirthInput.prop('label')).toEqual('patient.email')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the address of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'address')
    expect(dateOfBirthInput.prop('value')).toEqual(patient.address)
    expect(dateOfBirthInput.prop('label')).toEqual('patient.address')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the age and date of birth as approximate if patient.isApproximateDateOfBirth is true', async () => {
    let wrapper: any
    patient.isApproximateDateOfBirth = true
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <GeneralInformation patient={patient} />)
        </Router>,
      )
    })

    wrapper.update()

    const ageInput = wrapper.findWhere((w: any) => w.prop('name') === 'approximateAge')
    expect(ageInput.prop('value')).toEqual('0')
    expect(ageInput.prop('label')).toEqual('patient.approximateAge')
    expect(ageInput.prop('isEditable')).toBeFalsy()
  })
})
