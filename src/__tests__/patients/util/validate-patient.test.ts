import { addDays } from 'date-fns'

import validatePatient from '../../../patients/util/validate-patient'

const patient = {
  id: 'abc123',
  sex: 'Male',
  givenName: 'John',
  dateOfBirth: '01/11/1988',
  isApproximateDateOfBirth: false,
  code: 'abc123',
  index: '1',
  carePlans: [],
  careGoals: [],
  bloodType: 'A+',
  visits: [],
  rev: 'asd',
  createdAt: '01/01/2020',
  updatedAt: '01/01/2020',
  phoneNumbers: [],
  emails: [],
  addresses: [],
}

describe('validate patient', () => {
  it('should validate the patient required fields', () => {
    const error = validatePatient({ ...patient, givenName: '' })

    expect(error).toEqual({
      givenName: 'patient.errors.patientGivenNameFeedback',
    })
  })

  it('should validate that the patient birthday is not a future date', () => {
    const error = validatePatient({
      ...patient,
      dateOfBirth: addDays(new Date(), 4).toISOString(),
    })

    expect(error).toEqual({
      dateOfBirth: 'patient.errors.patientDateOfBirthFeedback',
    })
  })

  it('should validate that the patient phone number is a valid phone number', () => {
    const error = validatePatient({
      ...patient,
      phoneNumbers: [{ id: 'abc', value: 'not a phone number' }],
    })

    expect(error).toEqual({
      phoneNumbers: ['patient.errors.invalidPhoneNumber'],
    })
  })

  it('should validate that the patient email is a valid email', () => {
    const error = validatePatient({
      ...patient,
      emails: [{ id: 'abc', value: 'not a phone number' }],
    })

    expect(error).toEqual({
      emails: ['patient.errors.invalidEmail'],
    })
  })

  it('should validate fields that should only contian alpha characters', () => {
    const error = validatePatient({
      ...patient,
      suffix: 'A123',
      familyName: 'B456',
      prefix: 'C987',
      preferredLanguage: 'D321',
    })

    expect(error).toEqual({
      suffix: 'patient.errors.patientNumInSuffixFeedback',
      familyName: 'patient.errors.patientNumInFamilyNameFeedback',
      prefix: 'patient.errors.patientNumInPrefixFeedback',
      preferredLanguage: 'patient.errors.patientNumInPreferredLanguageFeedback',
    })
  })
})
