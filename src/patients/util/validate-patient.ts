import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import validator from 'validator'

import { ContactInfoPiece } from '../../shared/model/ContactInformation'
import Patient from '../../shared/model/Patient'

const validateEmails = (emails: ContactInfoPiece[] | undefined) =>
  (emails ?? []).map((email) =>
    !validator.isEmail(email.value) ? 'patient.errors.invalidEmail' : undefined,
  )

const validatePhoneNumbers = (phoneNumbers: ContactInfoPiece[] | undefined) =>
  (phoneNumbers ?? []).map((phone) =>
    !validator.isMobilePhone(phone.value) ? 'patient.errors.invalidPhoneNumber' : undefined,
  )

const existAndIsAfterToday = (value: string | undefined) => {
  if (!value) {
    return false
  }

  const today = new Date(Date.now())
  const dateOfBirth = parseISO(value)

  return isAfter(dateOfBirth, today)
}

const existAndHasNumbers = (value: string | undefined) => value && /\d/.test(value)

interface IPatientFieldErrors {
  givenName?: 'patient.errors.patientGivenNameFeedback'
  dateOfBirth?: 'patient.errors.patientDateOfBirthFeedback'
  suffix?: 'patient.errors.patientNumInSuffixFeedback'
  prefix?: 'patient.errors.patientNumInPrefixFeedback'
  familyName?: 'patient.errors.patientNumInFamilyNameFeedback'
  preferredLanguage?: 'patient.errors.patientNumInPreferredLanguageFeedback'
  emails?: ('patient.errors.invalidEmail' | undefined)[]
  phoneNumbers?: ('patient.errors.invalidPhoneNumber' | undefined)[]
}

export class PatientValidationError extends Error {
  public fieldErrors: IPatientFieldErrors

  constructor() {
    super('Patient data is invalid.')
    this.name = 'PatientValidationError'
    this.fieldErrors = {}
  }

  get count(): number {
    return Object.keys(this.fieldErrors).length
  }
}

export default function validatePatient(patient: Patient) {
  const error = new PatientValidationError()

  if (!patient.givenName) {
    error.fieldErrors.givenName = 'patient.errors.patientGivenNameFeedback'
  }

  if (existAndIsAfterToday(patient.dateOfBirth)) {
    error.fieldErrors.dateOfBirth = 'patient.errors.patientDateOfBirthFeedback'
  }

  if (existAndHasNumbers(patient.suffix)) {
    error.fieldErrors.suffix = 'patient.errors.patientNumInSuffixFeedback'
  }

  if (existAndHasNumbers(patient.prefix)) {
    error.fieldErrors.prefix = 'patient.errors.patientNumInPrefixFeedback'
  }

  if (existAndHasNumbers(patient.familyName)) {
    error.fieldErrors.familyName = 'patient.errors.patientNumInFamilyNameFeedback'
  }

  if (existAndHasNumbers(patient.preferredLanguage)) {
    error.fieldErrors.preferredLanguage = 'patient.errors.patientNumInPreferredLanguageFeedback'
  }

  const emailsErrors = validateEmails(patient.emails)
  const phoneNumbersErrors = validatePhoneNumbers(patient.phoneNumbers)

  if (emailsErrors.some(Boolean)) {
    error.fieldErrors.emails = emailsErrors
  }

  if (phoneNumbersErrors.some(Boolean)) {
    error.fieldErrors.phoneNumbers = phoneNumbersErrors
  }

  if (error.count === 0) {
    return null
  }

  return error
}
