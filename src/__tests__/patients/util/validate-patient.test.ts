import addDays from 'date-fns/addDays'

import validatePatient, { PatientValidationError } from '../../../patients/util/validate-patient'
import Patient from '../../../shared/model/Patient'

const patient: Patient = {
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
  describe('PatientValidationError class', () => {
    it('should count the amount of errors', () => {
      const error = new PatientValidationError()

      expect(error.count).toEqual(0)

      error.fieldErrors.givenName = 'patient.errors.patientGivenNameFeedback'
      error.fieldErrors.dateOfBirth = 'patient.errors.patientDateOfBirthFeedback'
      error.fieldErrors.suffix = 'patient.errors.patientNumInSuffixFeedback'

      expect(error.count).toEqual(3)

      error.fieldErrors.prefix = 'patient.errors.patientNumInPrefixFeedback'
      error.fieldErrors.familyName = 'patient.errors.patientNumInFamilyNameFeedback'
      error.fieldErrors.preferredLanguage = 'patient.errors.patientNumInPreferredLanguageFeedback'
      error.fieldErrors.emails = ['patient.errors.invalidEmail']
      error.fieldErrors.phoneNumbers = ['patient.errors.invalidPhoneNumber']

      expect(error.count).toEqual(8)
    })
  })

  it('returns null when patient is valid', () => {
    const error = validatePatient({ ...patient })
    expect(error).toEqual(null)
  })

  it('should validate the patient required fields', () => {
    const error = validatePatient({ ...patient, givenName: '' })

    expect(error?.fieldErrors.givenName).toEqual('patient.errors.patientGivenNameFeedback')
    expect(error?.count).toEqual(1)
  })

  it('should validate that the patient birthday is not a future date', () => {
    const error = validatePatient({
      ...patient,
      dateOfBirth: addDays(new Date(), 4).toISOString(),
    })

    expect(error?.fieldErrors.dateOfBirth).toEqual('patient.errors.patientDateOfBirthFeedback')
    expect(error?.count).toEqual(1)
  })

  it('should validate that the patient phone number is a valid phone number', () => {
    const error = validatePatient({
      ...patient,
      phoneNumbers: [{ id: 'abc', value: 'not a phone number' }],
    })

    expect(error?.fieldErrors.phoneNumbers).toEqual(['patient.errors.invalidPhoneNumber'])
    expect(error?.count).toEqual(1)
  })

  it('should validate that the patient email is a valid email', () => {
    const error = validatePatient({
      ...patient,
      emails: [{ id: 'abc', value: 'not a phone number' }],
    })

    expect(error?.fieldErrors.emails).toEqual(['patient.errors.invalidEmail'])
    expect(error?.count).toEqual(1)
  })

  it('should validate fields that should only contian alpha characters', () => {
    const error = validatePatient({
      ...patient,
      suffix: 'A123',
      familyName: 'B456',
      prefix: 'C987',
      preferredLanguage: 'D321',
    })

    expect(error?.fieldErrors.suffix).toEqual('patient.errors.patientNumInSuffixFeedback')
    expect(error?.fieldErrors.familyName).toEqual('patient.errors.patientNumInFamilyNameFeedback')
    expect(error?.fieldErrors.prefix).toEqual('patient.errors.patientNumInPrefixFeedback')
    expect(error?.fieldErrors.preferredLanguage).toEqual(
      'patient.errors.patientNumInPreferredLanguageFeedback',
    )

    expect(error?.count).toEqual(4)
  })
})
