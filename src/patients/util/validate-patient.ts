import { isAfter, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'
import validator from 'validator'

import Patient from '../../shared/model/Patient'

interface ValidationError {
  message?: string
  givenName?: string
  dateOfBirth?: string
  suffix?: string
  prefix?: string
  familyName?: string
  preferredLanguage?: string
  emails?: (string | undefined)[]
  phoneNumbers?: (string | undefined)[]
}

export default function validatePatient(patient: Patient) {
  const error: ValidationError = {}

  const regexContainsNumber = /\d/

  if (!patient.givenName) {
    error.givenName = 'patient.errors.patientGivenNameFeedback'
  }

  if (patient.dateOfBirth) {
    const today = new Date(Date.now())
    const dob = parseISO(patient.dateOfBirth)
    if (isAfter(dob, today)) {
      error.dateOfBirth = 'patient.errors.patientDateOfBirthFeedback'
    }
  }

  if (patient.suffix) {
    if (regexContainsNumber.test(patient.suffix)) {
      error.suffix = 'patient.errors.patientNumInSuffixFeedback'
    }
  }

  if (patient.prefix) {
    if (regexContainsNumber.test(patient.prefix)) {
      error.prefix = 'patient.errors.patientNumInPrefixFeedback'
    }
  }

  if (patient.familyName) {
    if (regexContainsNumber.test(patient.familyName)) {
      error.familyName = 'patient.errors.patientNumInFamilyNameFeedback'
    }
  }

  if (patient.preferredLanguage) {
    if (regexContainsNumber.test(patient.preferredLanguage)) {
      error.preferredLanguage = 'patient.errors.patientNumInPreferredLanguageFeedback'
    }
  }

  if (patient.emails) {
    const errors: (string | undefined)[] = []
    patient.emails.forEach((email) => {
      if (!validator.isEmail(email.value)) {
        errors.push('patient.errors.invalidEmail')
      } else {
        errors.push(undefined)
      }
    })
    // Only add to error obj if there's an error
    if (errors.some((value) => value !== undefined)) {
      error.emails = errors
    }
  }

  if (patient.phoneNumbers) {
    const errors: (string | undefined)[] = []
    patient.phoneNumbers.forEach((phoneNumber) => {
      if (!validator.isMobilePhone(phoneNumber.value)) {
        errors.push('patient.errors.invalidPhoneNumber')
      } else {
        errors.push(undefined)
      }
    })
    // Only add to error obj if there's an error
    if (errors.some((value) => value !== undefined)) {
      error.phoneNumbers = errors
    }
  }

  if (!isEmpty(error)) {
    error.message = 'patient.errors.createPatientError'
  }

  return error
}
