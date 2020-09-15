import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isAfter, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'
import validator from 'validator'

import PatientRepository from '../shared/db/PatientRepository'
import Diagnosis from '../shared/model/Diagnosis'
import Patient from '../shared/model/Patient'
import { AppThunk } from '../shared/store'
import { uuid } from '../shared/util/uuid'
import { cleanupPatient } from './util/set-patient-helper'

interface PatientState {
  status: 'loading' | 'error' | 'completed'
  isUpdatedSuccessfully: boolean
  patient: Patient
  relatedPersons: Patient[]
  createError?: Error
  updateError?: Error
  allergyError?: AddAllergyError
  diagnosisError?: AddDiagnosisError
  relatedPersonError?: AddRelatedPersonError
}

interface Error {
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

interface AddRelatedPersonError {
  message?: string
  relatedPerson?: string
  relationshipType?: string
}

interface AddAllergyError {
  message?: string
  name?: string
}

interface AddDiagnosisError {
  message?: string
  name?: string
  date?: string
  status?: string
}

const initialState: PatientState = {
  status: 'loading',
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
  relatedPersons: [],
  createError: undefined,
  updateError: undefined,
  diagnosisError: undefined,
  relatedPersonError: undefined,
}

function start(state: PatientState) {
  state.status = 'loading'
  state.createError = {}
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientStart: start,
    fetchPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.status = 'completed'
      state.patient = payload
    },
    createPatientStart: start,
    createPatientSuccess(state) {
      state.status = 'completed'
    },
    createPatientError(state, { payload }: PayloadAction<Error>) {
      state.status = 'error'
      state.createError = payload
    },
    updatePatientStart: start,
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.status = 'completed'
      state.patient = payload
    },
    updatePatientError(state, { payload }: PayloadAction<Error>) {
      state.status = 'error'
      state.updateError = payload
    },
    addDiagnosisError(state, { payload }: PayloadAction<AddDiagnosisError>) {
      state.status = 'error'
      state.diagnosisError = payload
    },
  },
})

export const {
  fetchPatientStart,
  fetchPatientSuccess,
  createPatientStart,
  createPatientSuccess,
  createPatientError,
  updatePatientStart,
  updatePatientSuccess,
  updatePatientError,
  addDiagnosisError,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchPatientStart())
  const patient = await PatientRepository.find(id)
  dispatch(fetchPatientSuccess(patient))
}

function validatePatient(patient: Patient) {
  const error: Error = {}

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

  return error
}

export const createPatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())

  const cleanPatient = cleanupPatient(patient)
  const newPatientError = validatePatient(cleanPatient)

  if (isEmpty(newPatientError)) {
    const newPatient = await PatientRepository.save(cleanPatient)
    dispatch(createPatientSuccess())

    if (onSuccess) {
      onSuccess(newPatient)
    }
  } else {
    newPatientError.message = 'patient.errors.createPatientError'
    dispatch(createPatientError(newPatientError))
  }
}

export const updatePatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())

  const cleanPatient = cleanupPatient(patient)
  const updateError = validatePatient(cleanPatient)

  if (isEmpty(updateError)) {
    const updatedPatient = await PatientRepository.saveOrUpdate(cleanPatient)
    dispatch(updatePatientSuccess(updatedPatient))

    if (onSuccess) {
      onSuccess(updatedPatient)
    }
  } else {
    updateError.message = 'patient.errors.updatePatientError'
    dispatch(updatePatientError(updateError))
  }
}

function validateDiagnosis(diagnosis: Diagnosis) {
  const error: AddDiagnosisError = {}

  if (!diagnosis.name) {
    error.name = 'patient.diagnoses.error.nameRequired'
  }

  if (!diagnosis.diagnosisDate) {
    error.date = 'patient.diagnoses.error.dateRequired'
  }

  if (!diagnosis.onsetDate) {
    error.date = 'patient.diagnoses.error.dateRequired'
  }

  if (!diagnosis.status) {
    error.status = 'patient.diagnoses.error.statusRequired'
  }
  return error
}

export const addDiagnosis = (
  patientId: string,
  diagnosis: Diagnosis,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newDiagnosisError = validateDiagnosis(diagnosis)

  if (isEmpty(newDiagnosisError)) {
    const patient = await PatientRepository.find(patientId)
    const diagnoses = patient.diagnoses || []
    diagnoses.push({ id: uuid(), ...diagnosis })
    patient.diagnoses = diagnoses

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newDiagnosisError.message = 'patient.diagnoses.error.unableToAdd'
    dispatch(addDiagnosisError(newDiagnosisError))
  }
}

export default patientSlice.reducer
