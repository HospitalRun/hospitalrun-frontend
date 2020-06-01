import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isAfter, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'
import validator from 'validator'

import PatientRepository from '../clients/db/PatientRepository'
import Address from '../model/Address'
import Allergy from '../model/Allergy'
import Diagnosis from '../model/Diagnosis'
import Email from '../model/Email'
import Note from '../model/Note'
import Patient from '../model/Patient'
import PhoneNumber from '../model/PhoneNumber'
import RelatedPerson from '../model/RelatedPerson'
import { AppThunk } from '../store'
import { uuid } from '../util/uuid'

interface PatientState {
  status: 'loading' | 'error' | 'completed'
  isUpdatedSuccessfully: boolean
  patient: Patient
  relatedPersons: Patient[]
  createError?: Error
  updateError?: Error
  phoneNumberError?: AddPhoneNumberError
  emailError?: AddEmailError
  allergyError?: AddAllergyError
  diagnosisError?: AddDiagnosisError
  noteError?: AddNoteError
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
  email?: string
  phoneNumber?: string
}

interface AddRelatedPersonError {
  message?: string
  relatedPerson?: string
  relationshipType?: string
}

interface AddPhoneNumberError {
  message?: string
  name?: string
}

interface AddEmailError {
  message?: string
  name?: string
}

interface AddAllergyError {
  message?: string
  name?: string
}

interface AddDiagnosisError {
  message?: string
  name?: string
  date?: string
}

interface AddNoteError {
  message?: string
  note?: string
}

const initialState: PatientState = {
  status: 'loading',
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
  relatedPersons: [],
  createError: undefined,
  updateError: undefined,
  allergyError: undefined,
  diagnosisError: undefined,
  noteError: undefined,
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
    addPhoneNumberError(state, { payload }: PayloadAction<AddPhoneNumberError>) {
      state.status = 'error'
      state.phoneNumberError = payload
    },
    addEmailError(state, { payload }: PayloadAction<AddEmailError>) {
      state.status = 'error'
      state.emailError = payload
    },
    addAllergyError(state, { payload }: PayloadAction<AddAllergyError>) {
      state.status = 'error'
      state.allergyError = payload
    },
    addDiagnosisError(state, { payload }: PayloadAction<AddDiagnosisError>) {
      state.status = 'error'
      state.diagnosisError = payload
    },
    addRelatedPersonError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.relatedPersonError = payload
    },
    addNoteError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.noteError = payload
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
  addPhoneNumberError,
  addEmailError,
  addAllergyError,
  addDiagnosisError,
  addRelatedPersonError,
  addNoteError,
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

  if (patient.phoneNumbers) {
    patient.phoneNumbers.forEach((phone: PhoneNumber) => {
      if (!validator.isMobilePhone(phone.phoneNumber)) {
        error.phoneNumber = 'patient.errors.invalidPhoneNumber'
      }
    })
  }

  if (patient.emails) {
    patient.emails.forEach((email: Email) => {
      if (!validator.isEmail(email.email)) {
        error.email = 'patient.errors.invalidEmail'
      }
    })
  }

  return error
}

export const createPatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())

  const newPatientError = validatePatient(patient)

  if (isEmpty(newPatientError)) {
    const newPatient = await PatientRepository.save(patient)
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
  const updateError = validatePatient(patient)
  if (isEmpty(updateError)) {
    const updatedPatient = await PatientRepository.saveOrUpdate(patient)
    dispatch(updatePatientSuccess(updatedPatient))

    if (onSuccess) {
      onSuccess(updatedPatient)
    }
  } else {
    updateError.message = 'patient.errors.updatePatientError'
    dispatch(updatePatientError(updateError))
  }
}

function validateRelatedPerson(relatedPerson: RelatedPerson) {
  const error: AddRelatedPersonError = {}

  if (!relatedPerson.patientId) {
    error.relatedPerson = 'patient.relatedPersons.error.relatedPersonRequired'
  }

  if (!relatedPerson.type) {
    error.relationshipType = 'patient.relatedPersons.error.relationshipTypeRequired'
  }

  return error
}

export const addRelatedPerson = (
  patientId: string,
  relatedPerson: RelatedPerson,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newRelatedPersonError = validateRelatedPerson(relatedPerson)

  if (isEmpty(newRelatedPersonError)) {
    const patient = await PatientRepository.find(patientId)
    const relatedPersons = patient.relatedPersons || []
    relatedPersons.push({ id: uuid(), ...relatedPerson })
    patient.relatedPersons = relatedPersons

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newRelatedPersonError.message = 'patient.relatedPersons.error.unableToAddRelatedPerson'
    dispatch(addRelatedPersonError(newRelatedPersonError))
  }
}

export const removeRelatedPerson = (
  patientId: string,
  relatedPersonId: string,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const patient = await PatientRepository.find(patientId)
  patient.relatedPersons = patient.relatedPersons?.filter((r) => r.patientId !== relatedPersonId)

  await dispatch(updatePatient(patient, onSuccess))
}

function validateDiagnosis(diagnosis: Diagnosis) {
  const error: AddDiagnosisError = {}

  if (!diagnosis.name) {
    error.name = 'patient.diagnoses.error.nameRequired'
  }

  if (!diagnosis.diagnosisDate) {
    error.date = 'patient.diagnoses.error.dateRequired'
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

export const addEmptyPhoneNumber = (
  patientId: string,
  phoneNumber: PhoneNumber,
  emails: Email[],
  addresses: Address[],
): AppThunk => async (dispatch) => {
  const patient = await PatientRepository.find(patientId)

  patient.emails = emails
  patient.addresses = addresses

  const phoneNumbers = patient.phoneNumbers || []
  phoneNumbers.push({ id: uuid(), ...phoneNumber })
  patient.phoneNumbers = phoneNumbers

  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
}

export const addEmptyEmail = (
  patientId: string,
  phoneNumbers: PhoneNumber[],
  email: Email,
  addresses: Address[],
): AppThunk => async (dispatch) => {
  const patient = await PatientRepository.find(patientId)

  patient.phoneNumbers = phoneNumbers
  patient.addresses = addresses

  const emails = patient.emails || []
  emails.push({ id: uuid(), ...email })
  patient.emails = emails

  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
}

export const addEmptyAddress = (
  patientId: string,
  phoneNumbers: PhoneNumber[],
  emails: Email[],
  address: Address,
): AppThunk => async (dispatch) => {
  const patient = await PatientRepository.find(patientId)

  patient.phoneNumbers = phoneNumbers
  patient.emails = emails

  const addresses = patient.addresses || []
  addresses.push({ id: uuid(), ...address })
  patient.addresses = addresses

  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
}

function validateAllergy(allergy: Allergy) {
  const error: AddAllergyError = {}

  if (!allergy.name) {
    error.name = 'patient.allergies.error.nameRequired'
  }

  return error
}

export const addAllergy = (
  patientId: string,
  allergy: Allergy,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newAllergyError = validateAllergy(allergy)

  if (isEmpty(newAllergyError)) {
    const patient = await PatientRepository.find(patientId)
    const allergies = patient.allergies || []
    allergies.push({ id: uuid(), ...allergy })
    patient.allergies = allergies

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newAllergyError.message = 'patient.allergies.error.unableToAdd'
    dispatch(addAllergyError(newAllergyError))
  }
}

function validateNote(note: Note) {
  const error: AddNoteError = {}
  if (!note.text) {
    error.message = 'patient.notes.error.noteRequired'
  }

  return error
}

export const addNote = (
  patientId: string,
  note: Note,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const newNoteError = validateNote(note)

  if (isEmpty(newNoteError)) {
    const patient = await PatientRepository.find(patientId)
    const notes = patient.notes || []
    notes.push({ id: uuid(), date: new Date().toISOString(), ...note })
    patient.notes = notes

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    newNoteError.message = 'patient.notes.error.unableToAdd'
    dispatch(addNoteError(newNoteError))
  }
}

export default patientSlice.reducer
