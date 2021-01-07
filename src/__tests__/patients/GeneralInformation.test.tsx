import { Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import startOfDay from 'date-fns/startOfDay'
import subYears from 'date-fns/subYears'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import GeneralInformation from '../../patients/GeneralInformation'
import Patient from '../../shared/model/Patient'

describe('Error handling', () => {
  it('should display errors', () => {
    const error = {
      message: 'some message',
      givenName: 'given name message',
      dateOfBirth: 'date of birth message',
      phoneNumbers: ['phone number message'],
      emails: ['email message'],
    }

    const wrapper = mount(
      <GeneralInformation
        patient={
          {
            phoneNumbers: [{ value: 'not a phone number', id: '123' }],
            emails: [{ value: 'not an email', id: '456' }],
          } as Patient
        }
        isEditable
        error={error}
      />,
    )
    wrapper.update()

    const errorMessage = wrapper.find(Alert)
    const givenNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'givenName')
    const dateOfBirthInput = wrapper.findWhere((w: any) => w.prop('name') === 'dateOfBirth')
    const phoneNumberInput = wrapper.findWhere((w: any) => w.prop('name') === 'phoneNumber0')
    const emailInput = wrapper.findWhere((w: any) => w.prop('name') === 'email0')

    expect(errorMessage).toBeTruthy()
    expect(errorMessage.prop('message')).toMatch(error.message)

    expect(givenNameInput.prop('isInvalid')).toBeTruthy()
    expect(givenNameInput.prop('feedback')).toEqual(error.givenName)

    expect(dateOfBirthInput.prop('isInvalid')).toBeTruthy()
    expect(dateOfBirthInput.prop('feedback')).toEqual(error.dateOfBirth)

    expect(phoneNumberInput.prop('isInvalid')).toBeTruthy()
    expect(phoneNumberInput.prop('feedback')).toEqual(error.phoneNumbers[0])

    expect(emailInput.prop('isInvalid')).toBeTruthy()
    expect(emailInput.prop('feedback')).toEqual(error.emails[0])
  })
})

describe('General Information, without isEditable', () => {
  let wrapper: ReactWrapper
  let history = createMemoryHistory()
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    sex: 'male',
    type: 'charity',
    bloodType: 'A-',
    dateOfBirth: startOfDay(subYears(new Date(), 30)).toISOString(),
    isApproximateDateOfBirth: false,
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumbers: [
      { value: '123456', type: undefined, id: '123' },
      { value: '789012', type: undefined, id: '456' },
    ],
    emails: [
      { value: 'abc@email.com', type: undefined, id: '789' },
      { value: 'xyz@email.com', type: undefined, id: '987' },
    ],
    addresses: [
      { value: 'address A', type: undefined, id: '654' },
      { value: 'address B', type: undefined, id: '321' },
    ],
    code: 'P00001',
  } as Patient

  beforeEach(() => {
    Date.now = jest.fn().mockReturnValue(new Date().valueOf())
    jest.restoreAllMocks()
    history = createMemoryHistory()
    wrapper = mount(
      <Router history={history}>
        <GeneralInformation patient={patient} />)
      </Router>,
    )
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
    expect(sexSelect.prop('defaultSelected')[0].value).toEqual(patient.sex)
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

  it('should render the blood type', () => {
    const bloodTypeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'bloodType')
    expect(bloodTypeSelect.prop('defaultSelected')[0].value).toEqual(patient.bloodType)
    expect(bloodTypeSelect.prop('label')).toEqual('patient.bloodType')
    expect(bloodTypeSelect.prop('isEditable')).toBeFalsy()
    expect(bloodTypeSelect.prop('options')).toHaveLength(9)
    expect(bloodTypeSelect.prop('options')[0].label).toEqual('bloodType.apositive')
    expect(bloodTypeSelect.prop('options')[0].value).toEqual('A+')
    expect(bloodTypeSelect.prop('options')[1].label).toEqual('bloodType.anegative')
    expect(bloodTypeSelect.prop('options')[1].value).toEqual('A-')
    expect(bloodTypeSelect.prop('options')[2].label).toEqual('bloodType.abpositive')
    expect(bloodTypeSelect.prop('options')[2].value).toEqual('AB+')
    expect(bloodTypeSelect.prop('options')[3].label).toEqual('bloodType.abnegative')
    expect(bloodTypeSelect.prop('options')[3].value).toEqual('AB-')
    expect(bloodTypeSelect.prop('options')[4].label).toEqual('bloodType.bpositive')
    expect(bloodTypeSelect.prop('options')[4].value).toEqual('B+')
    expect(bloodTypeSelect.prop('options')[5].label).toEqual('bloodType.bnegative')
    expect(bloodTypeSelect.prop('options')[5].value).toEqual('B-')
    expect(bloodTypeSelect.prop('options')[6].label).toEqual('bloodType.opositive')
    expect(bloodTypeSelect.prop('options')[6].value).toEqual('O+')
    expect(bloodTypeSelect.prop('options')[7].label).toEqual('bloodType.onegative')
    expect(bloodTypeSelect.prop('options')[7].value).toEqual('O-')
    expect(bloodTypeSelect.prop('options')[8].label).toEqual('bloodType.unknown')
    expect(bloodTypeSelect.prop('options')[8].value).toEqual('unknown')
  })

  it('should render the patient type select', () => {
    const typeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'type')
    expect(typeSelect.prop('defaultSelected')[0].value).toEqual(patient.type)
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
    expect(dateOfBirthInput.prop('maxDate')).toEqual(new Date(Date.now()))
    expect(dateOfBirthInput.prop('isEditable')).toBeFalsy()
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

    const approximateAgeInput = wrapper.findWhere((w: any) => w.prop('name') === 'approximateAge')

    expect(approximateAgeInput.prop('value')).toEqual('30')
    expect(approximateAgeInput.prop('label')).toEqual('patient.approximateAge')
    expect(approximateAgeInput.prop('isEditable')).toBeFalsy()
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

  it('should render the phone numbers of the patient', () => {
    patient.phoneNumbers.forEach((phoneNumber, i) => {
      const phoneNumberInput = wrapper.findWhere((w: any) => w.prop('name') === `phoneNumber${i}`)
      expect(phoneNumberInput.prop('value')).toEqual(phoneNumber.value)
      expect(phoneNumberInput.prop('isEditable')).toBeFalsy()
    })
  })

  it('should render the emails of the patient', () => {
    patient.emails.forEach((email, i) => {
      const emailInput = wrapper.findWhere((w: any) => w.prop('name') === `email${i}`)
      expect(emailInput.prop('value')).toEqual(email.value)
      expect(emailInput.prop('isEditable')).toBeFalsy()
    })
  })

  it('should render the addresses of the patient', () => {
    patient.addresses.forEach((address, i) => {
      const addressInput = wrapper.findWhere((w: any) => w.prop('name') === `address${i}`)
      expect(addressInput.prop('value')).toEqual(address.value)
      expect(addressInput.prop('isEditable')).toBeFalsy()
    })
  })
})

describe('General Information, isEditable', () => {
  let wrapper: ReactWrapper
  let history: MemoryHistory
  let onFieldChange: jest.Mock
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    sex: 'male',
    bloodType: 'A-',
    type: 'charity',
    dateOfBirth: startOfDay(subYears(new Date(), 30)).toISOString(),
    isApproximateDateOfBirth: false,
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumbers: [
      { value: '123456', type: undefined, id: '123' },
      { value: '789012', type: undefined, id: '456' },
    ],
    emails: [
      { value: 'abc@email.com', type: undefined, id: '789' },
      { value: 'xyz@email.com', type: undefined, id: '987' },
    ],
    addresses: [
      { value: 'address A', type: undefined, id: '654' },
      { value: 'address B', type: undefined, id: '321' },
    ],
    code: 'P00001',
  } as Patient

  beforeEach(() => {
    jest.restoreAllMocks()
    Date.now = jest.fn().mockReturnValue(new Date().valueOf())
    history = createMemoryHistory()
    onFieldChange = jest.fn()
    wrapper = mount(
      <Router history={history}>
        <GeneralInformation patient={patient} onChange={onFieldChange} isEditable />)
      </Router>,
    )
  })

  const expectedPrefix = 'expectedPrefix'
  const expectedGivenName = 'expectedGivenName'
  const expectedFamilyName = 'expectedFamilyName'
  const expectedSuffix = 'expectedSuffix'
  const expectedDateOfBirth = '1937-06-14T05:00:00.000Z'
  const expectedOccupation = 'expectedOccupation'
  const expectedPreferredLanguage = 'expectedPreferredLanguage'
  const expectedPhoneNumbers = [
    { value: '111111', type: undefined, id: '123' },
    { value: '222222', type: undefined, id: '456' },
  ]
  const expectedEmails = [
    { value: 'def@email.com', type: undefined, id: '789' },
    { value: 'uvw@email.com', type: undefined, id: '987' },
  ]
  const expectedAddresses = [
    { value: 'address C', type: undefined, id: '654' },
    { value: 'address D', type: undefined, id: '321' },
  ]
  const expectedBloodType = 'unknown'

  it('should render the prefix', () => {
    const prefixInput = wrapper.findWhere((w: any) => w.prop('name') === 'prefix')

    expect(prefixInput.prop('value')).toEqual(patient.prefix)
    expect(prefixInput.prop('label')).toEqual('patient.prefix')
    expect(prefixInput.prop('isEditable')).toBeTruthy()

    const input = prefixInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedPrefix
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, prefix: expectedPrefix })
  })

  it('should render the given name', () => {
    const givenNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'givenName')

    expect(givenNameInput.prop('value')).toEqual(patient.givenName)
    expect(givenNameInput.prop('label')).toEqual('patient.givenName')
    expect(givenNameInput.prop('isEditable')).toBeTruthy()

    const input = givenNameInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedGivenName
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, givenName: expectedGivenName })
  })

  it('should render the family name', () => {
    const familyNameInput = wrapper.findWhere((w: any) => w.prop('name') === 'familyName')

    expect(familyNameInput.prop('value')).toEqual(patient.familyName)
    expect(familyNameInput.prop('label')).toEqual('patient.familyName')
    expect(familyNameInput.prop('isEditable')).toBeTruthy()

    const input = familyNameInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedFamilyName
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, familyName: expectedFamilyName })
  })

  it('should render the suffix', () => {
    const suffixInput = wrapper.findWhere((w: any) => w.prop('name') === 'suffix')

    expect(suffixInput.prop('value')).toEqual(patient.suffix)
    expect(suffixInput.prop('label')).toEqual('patient.suffix')
    expect(suffixInput.prop('isEditable')).toBeTruthy()

    const input = suffixInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedSuffix
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, suffix: expectedSuffix })
  })

  it('should render the sex select', () => {
    const sexSelect = wrapper.findWhere((w: any) => w.prop('name') === 'sex')

    expect(sexSelect.prop('defaultSelected')[0].value).toEqual(patient.sex)
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
  })

  it('should render the blood type select', () => {
    const bloodTypeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'bloodType')
    expect(bloodTypeSelect.prop('defaultSelected')[0].value).toEqual(patient.bloodType)
    expect(bloodTypeSelect.prop('label')).toEqual('patient.bloodType')
    expect(bloodTypeSelect.prop('isEditable')).toBeTruthy()
    expect(bloodTypeSelect.prop('options')).toHaveLength(9)
    expect(bloodTypeSelect.prop('options')[0].label).toEqual('bloodType.apositive')
    expect(bloodTypeSelect.prop('options')[0].value).toEqual('A+')
    expect(bloodTypeSelect.prop('options')[1].label).toEqual('bloodType.anegative')
    expect(bloodTypeSelect.prop('options')[1].value).toEqual('A-')
    expect(bloodTypeSelect.prop('options')[2].label).toEqual('bloodType.abpositive')
    expect(bloodTypeSelect.prop('options')[2].value).toEqual('AB+')
    expect(bloodTypeSelect.prop('options')[3].label).toEqual('bloodType.abnegative')
    expect(bloodTypeSelect.prop('options')[3].value).toEqual('AB-')
    expect(bloodTypeSelect.prop('options')[4].label).toEqual('bloodType.bpositive')
    expect(bloodTypeSelect.prop('options')[4].value).toEqual('B+')
    expect(bloodTypeSelect.prop('options')[5].label).toEqual('bloodType.bnegative')
    expect(bloodTypeSelect.prop('options')[5].value).toEqual('B-')
    expect(bloodTypeSelect.prop('options')[6].label).toEqual('bloodType.opositive')
    expect(bloodTypeSelect.prop('options')[6].value).toEqual('O+')
    expect(bloodTypeSelect.prop('options')[7].label).toEqual('bloodType.onegative')
    expect(bloodTypeSelect.prop('options')[7].value).toEqual('O-')
    expect(bloodTypeSelect.prop('options')[8].label).toEqual('bloodType.unknown')
    expect(bloodTypeSelect.prop('options')[8].value).toEqual('unknown')
    act(() => {
      bloodTypeSelect.prop('onChange')([expectedBloodType])
    })
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({
      ...patient,
      bloodType: expectedBloodType,
    })
  })

  it('should render the patient type select', () => {
    const typeSelect = wrapper.findWhere((w: any) => w.prop('name') === 'type')

    expect(typeSelect.prop('defaultSelected')[0].value).toEqual(patient.type)
    expect(typeSelect.prop('label')).toEqual('patient.type')
    expect(typeSelect.prop('isEditable')).toBeTruthy()

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
    expect(dateOfBirthInput.prop('isEditable')).toBeTruthy()
    expect(dateOfBirthInput.prop('maxDate')).toEqual(new Date(Date.now()))

    act(() => {
      dateOfBirthInput.prop('onChange')(new Date(expectedDateOfBirth))
    })

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, dateOfBirth: expectedDateOfBirth })
  })

  it('should render the approximate age if patient.isApproximateDateOfBirth is true', async () => {
    patient.isApproximateDateOfBirth = true
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <GeneralInformation patient={patient} onChange={onFieldChange} isEditable />)
        </Router>,
      )
    })

    const approximateAgeInput = wrapper.findWhere((w: any) => w.prop('name') === 'approximateAge')

    expect(approximateAgeInput.prop('value')).toEqual('30')
    expect(approximateAgeInput.prop('label')).toEqual('patient.approximateAge')
    expect(approximateAgeInput.prop('isEditable')).toBeTruthy()

    const input = approximateAgeInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = '20'
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({
      ...patient,
      dateOfBirth: startOfDay(subYears(new Date(Date.now()), 20)).toISOString(),
    })
  })

  it('should render the occupation of the patient', () => {
    const occupationInput = wrapper.findWhere((w: any) => w.prop('name') === 'occupation')

    expect(occupationInput.prop('value')).toEqual(patient.occupation)
    expect(occupationInput.prop('label')).toEqual('patient.occupation')
    expect(occupationInput.prop('isEditable')).toBeTruthy()

    const input = occupationInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedOccupation
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({ ...patient, occupation: expectedOccupation })
  })

  it('should render the preferred language of the patient', () => {
    const preferredLanguageInput = wrapper.findWhere(
      (w: any) => w.prop('name') === 'preferredLanguage',
    )

    expect(preferredLanguageInput.prop('value')).toEqual(patient.preferredLanguage)
    expect(preferredLanguageInput.prop('label')).toEqual('patient.preferredLanguage')
    expect(preferredLanguageInput.prop('isEditable')).toBeTruthy()

    const input = preferredLanguageInput.find('input')
    input.getDOMNode<HTMLInputElement>().value = expectedPreferredLanguage
    input.simulate('change')

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({
      ...patient,
      preferredLanguage: expectedPreferredLanguage,
    })
  })

  it('should render the phone numbers of the patient', () => {
    patient.phoneNumbers.forEach((phoneNumber, i) => {
      const phoneNumberInput = wrapper.findWhere((w: any) => w.prop('name') === `phoneNumber${i}`)
      expect(phoneNumberInput.prop('value')).toEqual(phoneNumber.value)
      expect(phoneNumberInput.prop('isEditable')).toBeTruthy()

      const input = phoneNumberInput.find('input')
      input.getDOMNode<HTMLInputElement>().value = expectedPhoneNumbers[i].value
      input.simulate('change')
    })

    const calledWith = [] as any
    patient.phoneNumbers.forEach((_, i) => {
      const newPhoneNumbers = [] as any
      patient.phoneNumbers.forEach((__, j) => {
        if (j <= i) {
          newPhoneNumbers.push(expectedPhoneNumbers[j])
        } else {
          newPhoneNumbers.push(patient.phoneNumbers[j])
        }
      })
      calledWith.push({ ...patient, phoneNumbers: newPhoneNumbers })
    })

    expect(onFieldChange).toHaveBeenCalledTimes(calledWith.length)
    expect(onFieldChange).toHaveBeenNthCalledWith(1, calledWith[0])
    // expect(onFieldChange).toHaveBeenNthCalledWith(2, calledWith[1])
  })

  it('should render the emails of the patient', () => {
    patient.emails.forEach((email, i) => {
      const emailInput = wrapper.findWhere((w: any) => w.prop('name') === `email${i}`)
      expect(emailInput.prop('value')).toEqual(email.value)
      expect(emailInput.prop('isEditable')).toBeTruthy()

      const input = emailInput.find('input')
      input.getDOMNode<HTMLInputElement>().value = expectedEmails[i].value
      input.simulate('change')
    })

    const calledWith = [] as any
    patient.emails.forEach((_, i) => {
      const newEmails = [] as any
      patient.emails.forEach((__, j) => {
        if (j <= i) {
          newEmails.push(expectedEmails[j])
        } else {
          newEmails.push(patient.emails[j])
        }
      })
      calledWith.push({ ...patient, emails: newEmails })
    })

    expect(onFieldChange).toHaveBeenCalledTimes(calledWith.length)
    expect(onFieldChange).toHaveBeenNthCalledWith(1, calledWith[0])
    // expect(onFieldChange).toHaveBeenNthCalledWith(2, calledWith[1])
  })

  it('should render the addresses of the patient', () => {
    patient.addresses.forEach((address, i) => {
      const addressTextArea = wrapper.findWhere((w: any) => w.prop('name') === `address${i}`)
      expect(addressTextArea.prop('value')).toEqual(address.value)
      expect(addressTextArea.prop('isEditable')).toBeTruthy()

      const textarea = addressTextArea.find('textarea')
      textarea.getDOMNode<HTMLTextAreaElement>().value = expectedAddresses[i].value
      textarea.simulate('change')
    })

    const calledWith = [] as any
    patient.addresses.forEach((_, i) => {
      const newAddresses = [] as any
      patient.addresses.forEach((__, j) => {
        if (j <= i) {
          newAddresses.push(expectedAddresses[j])
        } else {
          newAddresses.push(patient.addresses[j])
        }
      })
      calledWith.push({ ...patient, addresses: newAddresses })
    })

    expect(onFieldChange).toHaveBeenCalledTimes(calledWith.length)
    expect(onFieldChange).toHaveBeenNthCalledWith(1, calledWith[0])
    // expect(onFieldChange).toHaveBeenNthCalledWith(2, calledWith[1])
  })
})
