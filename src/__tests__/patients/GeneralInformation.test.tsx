import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { mount, ReactWrapper } from 'enzyme'
import GeneralInformation from 'patients/GeneralInformation'
import { createMemoryHistory } from 'history'
import { startOfDay, subYears } from 'date-fns'
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

describe('General Information, without isEditable', () => {
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
    dateOfBirth: startOfDay(subYears(new Date(), 30)).toISOString(),
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

  it('should render the approximate age if patient.isApproximateDateOfBirth is true', async () => {
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

    expect(ageInput.prop('value')).toEqual('30')
    expect(ageInput.prop('label')).toEqual('patient.approximateAge')
    expect(ageInput.prop('isEditable')).toBeFalsy()
  })
})

describe('General Information, isEditable', () => {
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
    dateOfBirth: startOfDay(subYears(new Date(), 30)).toISOString(),
    isApproximateDateOfBirth: false,
  } as Patient

  let wrapper: ReactWrapper
  let history = createMemoryHistory()

  const onFieldChange = jest.fn()

  beforeEach(() => {
    history = createMemoryHistory()
    wrapper = mount(
      <Router history={history}>
        <GeneralInformation patient={patient} onFieldChange={onFieldChange} isEditable />)
      </Router>,
    )
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  const expectedPrefix = 'expectedPrefix'
  const expectedGivenName = 'expectedGivenName'
  const expectedFamilyName = 'expectedFamilyName'
  const expectedSuffix = 'expectedSuffix'
  const expectedSex = 'expectedSex'
  const expectedType = 'expectedType'
  const expectedOccupation = 'expectedOccupation'
  const expectedPreferredLanguage = 'expectedPreferredLanguage'
  const expectedPhoneNumber = 'expectedPhoneNumber'
  const expectedEmail = 'expectedEmail'
  const expectedAddress = 'expectedAddress'
  const expectedDateOfBirth = '1937-06-14T05:00:00.000Z'

  it('should render the prefix', () => {
    const prefixInput = wrapper.findWhere((w: any) => w.prop('name') === 'prefix')
    const generalInformation = wrapper.find(GeneralInformation)
    expect(prefixInput.prop('value')).toEqual(patient.prefix)
    expect(prefixInput.prop('label')).toEqual('patient.prefix')
    expect(prefixInput.prop('isEditable')).toBeTruthy()

    act(() => {
      prefixInput.prop('onChange')({ target: { value: expectedPrefix } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith('prefix', expectedPrefix)
  })

  it('should render the given name', () => {
    const givenNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'givenName')
    const generalInformation = wrapper.find(GeneralInformation)
    expect(givenNameInput.prop('value')).toEqual(patient.givenName)
    expect(givenNameInput.prop('label')).toEqual('patient.givenName')
    expect(givenNameInput.prop('isEditable')).toBeTruthy()

    act(() => {
      givenNameInput.prop('onChange')({ target: { value: expectedGivenName } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'givenName',
      expectedGivenName,
    )
  })

  it('should render the family name', () => {
    const familyNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'familyName')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(familyNameInput.prop('value')).toEqual(patient.familyName)
    expect(familyNameInput.prop('label')).toEqual('patient.familyName')
    expect(familyNameInput.prop('isEditable')).toBeTruthy()

    act(() => {
      familyNameInput.prop('onChange')({ target: { value: expectedFamilyName } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'familyName',
      expectedFamilyName,
    )
  })

  it('should render the suffix', () => {
    const suffixInput = wrapper.findWhere((w: any) => w.prop('name') === 'suffix')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(suffixInput.prop('value')).toEqual(patient.suffix)
    expect(suffixInput.prop('label')).toEqual('patient.suffix')
    expect(suffixInput.prop('isEditable')).toBeTruthy()

    act(() => {
      suffixInput.prop('onChange')({ target: { value: expectedSuffix } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith('suffix', expectedSuffix)
  })

  it('should render the sex select', () => {
    const sexSelect = wrapper.findWhere((w: any) => w.prop('name') === 'sex')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(sexSelect.prop('value')).toEqual(patient.sex)
    expect(sexSelect.prop('label')).toEqual('patient.sex')
    expect(sexSelect.prop('isEditable')).toBeTruthy()
    expect(sexSelect.prop('options')).toHaveLength(4)
    expect(sexSelect.prop('options')[0].label).toEqual('sex.male')
    expect(sexSelect.prop('options')[0].value).toEqual('male')
    expect(sexSelect.prop('options')[1].label).toEqual('sex.female')
    expect(sexSelect.prop('options')[1].value).toEqual('female')
    expect(sexSelect.prop('options')[2].label).toEqual('sex.other')
    expect(sexSelect.prop('options')[2].value).toEqual('other')
    expect(sexSelect.prop('options')[3].label).toEqual('sex.unknown')
    expect(sexSelect.prop('options')[3].value).toEqual('unknown')

    act(() => {
      sexSelect.prop('onChange')({ target: { value: expectedSex } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith('sex', expectedSex)
  })

  it('should render the patient type select', () => {
    const typeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'type')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(typeSelect.prop('value')).toEqual(patient.type)
    expect(typeSelect.prop('label')).toEqual('patient.type')
    expect(typeSelect.prop('isEditable')).toBeTruthy()
    expect(typeSelect.prop('options')).toHaveLength(2)
    expect(typeSelect.prop('options')[0].label).toEqual('patient.types.charity')
    expect(typeSelect.prop('options')[0].value).toEqual('charity')
    expect(typeSelect.prop('options')[1].label).toEqual('patient.types.private')
    expect(typeSelect.prop('options')[1].value).toEqual('private')

    act(() => {
      typeSelect.prop('onChange')({ target: { value: expectedType } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith('type', expectedType)
  })

  it('should render the date of the birth of the patient', () => {
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'dateOfBirth')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(dateOfBirthInput.prop('value')).toEqual(new Date(patient.dateOfBirth))
    expect(dateOfBirthInput.prop('label')).toEqual('patient.dateOfBirth')
    expect(dateOfBirthInput.prop('isEditable')).toBeTruthy()

    act(() => {
      dateOfBirthInput.prop('onChange')(new Date(expectedDateOfBirth))
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'dateOfBirth',
      expectedDateOfBirth,
    )
  })

  it('should render the occupation of the patient', () => {
    const occupationInput = wrapper.findWhere((w: any) => w.prop('name') === 'occupation')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(occupationInput.prop('value')).toEqual(patient.occupation)
    expect(occupationInput.prop('label')).toEqual('patient.occupation')
    expect(occupationInput.prop('isEditable')).toBeTruthy()

    act(() => {
      occupationInput.prop('onChange')({ target: { value: expectedOccupation } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'occupation',
      expectedOccupation,
    )
  })

  it('should render the preferred language of the patient', () => {
    const preferredLanguageInput = wrapper.findWhere(
      (w: any) => w.prop('name') === 'preferredLanguage',
    )
    const generalInformation = wrapper.find(GeneralInformation)

    expect(preferredLanguageInput.prop('value')).toEqual(patient.preferredLanguage)
    expect(preferredLanguageInput.prop('label')).toEqual('patient.preferredLanguage')
    expect(preferredLanguageInput.prop('isEditable')).toBeTruthy()

    act(() => {
      preferredLanguageInput.prop('onChange')({ target: { value: expectedPreferredLanguage } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'preferredLanguage',
      expectedPreferredLanguage,
    )
  })

  it('should render the phone number of the patient', () => {
    const phoneNumberInput = wrapper.findWhere((w: any) => w.prop('name') === 'phoneNumber')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(phoneNumberInput.prop('value')).toEqual(patient.phoneNumber)
    expect(phoneNumberInput.prop('label')).toEqual('patient.phoneNumber')
    expect(phoneNumberInput.prop('isEditable')).toBeTruthy()

    act(() => {
      phoneNumberInput.prop('onChange')({ target: { value: expectedPhoneNumber } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'phoneNumber',
      expectedPhoneNumber,
    )
  })

  it('should render the email of the patient', () => {
    const emailInput = wrapper.findWhere((w: any) => w.prop('name') === 'email')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(emailInput.prop('value')).toEqual(patient.email)
    expect(emailInput.prop('label')).toEqual('patient.email')
    expect(emailInput.prop('isEditable')).toBeTruthy()

    act(() => {
      emailInput.prop('onChange')({ target: { value: expectedEmail } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith('email', expectedEmail)
  })

  it('should render the address of the patient', () => {
    const addressInput = wrapper.findWhere((w: any) => w.prop('name') === 'address')
    const generalInformation = wrapper.find(GeneralInformation)

    expect(addressInput.prop('value')).toEqual(patient.address)
    expect(addressInput.prop('label')).toEqual('patient.address')
    expect(addressInput.prop('isEditable')).toBeTruthy()

    act(() => {
      addressInput.prop('onChange')({ currentTarget: { value: expectedAddress } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'address',
      expectedAddress,
    )
  })

  it('should render the approximate age if patient.isApproximateDateOfBirth is true', async () => {
    patient.isApproximateDateOfBirth = true
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <GeneralInformation patient={patient} onFieldChange={jest.fn()} isEditable />)
        </Router>,
      )
    })

    wrapper.update()

    const approximateAgeInput = wrapper.findWhere((w: any) => w.prop('name') === 'approximateAge')
    const generalInformation = wrapper.find(GeneralInformation)
    expect(approximateAgeInput.prop('value')).toEqual('30')
    expect(approximateAgeInput.prop('label')).toEqual('patient.approximateAge')
    expect(approximateAgeInput.prop('isEditable')).toBeTruthy()

    act(() => {
      approximateAgeInput.prop('onChange')({ target: { value: '20' } })
    })

    expect(generalInformation.prop('onFieldChange')).toHaveBeenCalledWith(
      'dateOfBirth',
      startOfDay(subYears(new Date(Date.now()), 20)).toISOString(),
    )
  })
})
