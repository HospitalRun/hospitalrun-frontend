import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { mount, ReactWrapper } from 'enzyme'
import GeneralInformation from 'patients/GeneralInformation'
import { createMemoryHistory } from 'history'
import { Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import Patient from '../../model/Patient'

describe('Error handling', () => {
  it('should display no given name error when errorMessage prop is non-empty string', () => {
    const history = createMemoryHistory()
    const wrapper = mount(
      <Router history={history}>
        <GeneralInformation
          patient={{} as Patient}
          isEditable
          errorMessage="patient.errors.patientGivenNameRequired"
        />
      </Router>,
    )

    const errorMessage = wrapper.find(Alert)
    expect(errorMessage).toBeTruthy()
    expect(errorMessage.prop('message')).toMatch('patient.errors.patientGivenNameRequired')
  })
})

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

  it('should render the prefix', () => {
    const prefixInput = wrapper.findWhere((w: any) => w.prop('name') === 'prefix')
    expect(prefixInput.prop('value')).toEqual(patient.prefix)
    expect(prefixInput.prop('label')).toEqual('patient.prefix')
    expect(prefixInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the given name', () => {
    const givenNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'givenName')
    expect(givenNameInput.prop('value')).toEqual(patient.givenName)
    expect(givenNameInput.prop('label')).toEqual('patient.givenName')
    expect(givenNameInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the family name', () => {
    const familyNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'familyName')
    expect(familyNameInput.prop('value')).toEqual(patient.familyName)
    expect(familyNameInput.prop('label')).toEqual('patient.familyName')
    expect(familyNameInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the suffix', () => {
    const suffixInput = wrapper.findWhere((w: any) => w.prop('name') === 'suffix')
    expect(suffixInput.prop('value')).toEqual(patient.suffix)
    expect(suffixInput.prop('label')).toEqual('patient.suffix')
    expect(suffixInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the sex select', () => {
    const sexSelect = wrapper.findWhere((w: any) => w.prop('name') === 'sex')
    expect(sexSelect.prop('value')).toEqual(patient.sex)
    expect(sexSelect.prop('label')).toEqual('patient.sex')
    expect(sexSelect.prop('isEditable')).toBeFalsy()
    expect(sexSelect.prop('options')).toHaveLength(4)
    expect(sexSelect.prop('options')[0].label).toEqual('sex.male')
    expect(sexSelect.prop('options')[0].value).toEqual('male')
    expect(sexSelect.prop('options')[1].label).toEqual('sex.female')
    expect(sexSelect.prop('options')[1].value).toEqual('female')
    expect(sexSelect.prop('options')[2].label).toEqual('sex.other')
    expect(sexSelect.prop('options')[2].value).toEqual('other')
    expect(sexSelect.prop('options')[3].label).toEqual('sex.unknown')
    expect(sexSelect.prop('options')[3].value).toEqual('unknown')
  })

  it('should render the patient type select', () => {
    const typeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'type')
    expect(typeSelect.prop('value')).toEqual(patient.type)
    expect(typeSelect.prop('label')).toEqual('patient.type')
    expect(typeSelect.prop('isEditable')).toBeFalsy()
    expect(typeSelect.prop('options')).toHaveLength(2)
    expect(typeSelect.prop('options')[0].label).toEqual('patient.types.charity')
    expect(typeSelect.prop('options')[0].value).toEqual('charity')
    expect(typeSelect.prop('options')[1].label).toEqual('patient.types.private')
    expect(typeSelect.prop('options')[1].value).toEqual('private')
  })

  it('should render the date of the birth of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'dateOfBirth')
    expect(dateOfBirthInput.prop('value')).toEqual(new Date(patient.dateOfBirth))
    expect(dateOfBirthInput.prop('label')).toEqual('patient.dateOfBirth')
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the occupation of the patient', () => {
    const occupationInput = wrapper.findWhere((w: any) => w.prop('name') === 'occupation')
    expect(occupationInput.prop('value')).toEqual(patient.occupation)
    expect(occupationInput.prop('label')).toEqual('patient.occupation')
    expect(occupationInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the preferred language of the patient', () => {
    const preferredLanguageInput = wrapper.findWhere(
      (w: any) => w.prop('name') === 'preferredLanguage',
    )
    expect(preferredLanguageInput.prop('value')).toEqual(patient.preferredLanguage)
    expect(preferredLanguageInput.prop('label')).toEqual('patient.preferredLanguage')
    expect(preferredLanguageInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the phone number of the patient', () => {
    const phoneNumberInput = wrapper.findWhere((w: any) => w.prop('name') === 'phoneNumber')
    expect(phoneNumberInput.prop('value')).toEqual(patient.phoneNumber)
    expect(phoneNumberInput.prop('label')).toEqual('patient.phoneNumber')
    expect(phoneNumberInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the email of the patient', () => {
    const emailInput = wrapper.findWhere((w: any) => w.prop('name') === 'email')
    expect(emailInput.prop('value')).toEqual(patient.email)
    expect(emailInput.prop('label')).toEqual('patient.email')
    expect(emailInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the address of the patient', () => {
    const addressInput = wrapper.findWhere((w: any) => w.prop('name') === 'address')
    expect(addressInput.prop('value')).toEqual(patient.address)
    expect(addressInput.prop('label')).toEqual('patient.address')
    expect(addressInput.prop('isEditable')).toBeFalsy()
  })

  it('should render the age and date of birth as approximate if patient.isApproximateDateOfBirth is true', async () => {
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
