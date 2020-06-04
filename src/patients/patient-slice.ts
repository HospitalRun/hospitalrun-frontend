import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isAfter, isBefore, parseISO } from 'date-fns'
import { isEmpty } from 'lodash'
import validator from 'validator'

import PatientRepository from '../clients/db/PatientRepository'
import Allergy from '../model/Allergy'
import CarePlan from '../model/CarePlan'
import Diagnosis from '../model/Diagnosis'
import Note from '../model/Note'
import Patient from '../model/Patient'
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
  allergyError?: AddAllergyError
  diagnosisError?: AddDiagnosisError
  noteError?: AddNoteError
  relatedPersonError?: AddRelatedPersonError
  carePlanError?: AddCarePlanError
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

interface AddCarePlanError {
  message?: string
  title?: string
  description?: string
  status?: string
  intent?: string
  startDate?: string
  endDate?: string
  note?: string
  condition?: string
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
  carePlanError: undefined,
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
    addCarePlanError(state, { payload }: PayloadAction<AddRelatedPersonError>) {
      state.status = 'error'
      state.carePlanError = payload
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
  addAllergyError,
  addDiagnosisError,
  addRelatedPersonError,
  addNoteError,
  addCarePlanError,
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

  if (patient.email) {
    if (!validator.isEmail(patient.email)) {
      error.email = 'patient.errors.invalidEmail'
    }
  }

  if (patient.phoneNumber) {
    if (!validator.isMobilePhone(patient.phoneNumber)) {
      error.phoneNumber = 'patient.errors.invalidPhoneNumber'
    }
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

function validateCarePlan(carePlan: CarePlan): AddCarePlanError {
  const error: AddCarePlanError = {}

  if (!carePlan.title) {
    error.title = 'patient.carePlans.error.titleRequired'
  }

  if (!carePlan.description) {
    error.description = 'patient.carePlans.error.descriptionRequired'
  }

  if (!carePlan.status) {
    error.status = 'patient.carePlans.error.statusRequired'
  }

  if (!carePlan.intent) {
    error.intent = 'patient.carePlans.error.intentRequired'
  }

  if (!carePlan.startDate) {
    error.startDate = 'patient.carePlans.error.startDateRequired'
  }

  if (!carePlan.endDate) {
    error.endDate = 'patient.carePlans.error.endDateRequired'
  }

  if (carePlan.startDate && carePlan.endDate) {
    if (isBefore(new Date(carePlan.endDate), new Date(carePlan.startDate))) {
      error.endDate = 'patient.carePlans.error.endDateMustBeAfterStartDate'
    }
  }

  if (!carePlan.diagnosisId) {
    error.condition = 'patient.carePlans.error.conditionRequired'
  }

  if (!carePlan.note) {
    error.note = 'patient.carePlans.error.noteRequired'
  }

  return error
}

export const addCarePlan = (
  patientId: string,
  carePlan: CarePlan,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  const carePlanError = validateCarePlan(carePlan)
  if (isEmpty(carePlanError)) {
    const patient = await PatientRepository.find(patientId)
    const carePlans = patient.carePlans || ([] as CarePlan[])
    carePlans.push({
      id: uuid(),
      createdOn: new Date(Date.now().valueOf()).toISOString(),
      ...carePlan,
    })
    patient.carePlans = carePlans

    await dispatch(updatePatient(patient, onSuccess))
  } else {
    carePlanError.message = 'patient.carePlans.error.unableToAdd'
    dispatch(addCarePlanError(carePlanError))
  }
}

export default patientSlice.reducer
