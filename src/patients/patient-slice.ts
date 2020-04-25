import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uuid } from '../util/uuid'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'
import RelatedPerson from '../model/RelatedPerson'
import Diagnosis from '../model/Diagnosis'
import Allergy from '../model/Allergy'

interface PatientState {
  isLoading: boolean
  isUpdatedSuccessfully: boolean
  patient: Patient
  relatedPersons: Patient[]
}

const initialState: PatientState = {
  isLoading: false,
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
  relatedPersons: [],
}

function startLoading(state: PatientState) {
  state.isLoading = true
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientStart: startLoading,
    createPatientStart: startLoading,
    updatePatientStart: startLoading,
    fetchPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
    createPatientSuccess(state) {
      state.isLoading = false
    },
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
  },
})

export const {
  fetchPatientStart,
  fetchPatientSuccess,
  createPatientStart,
  createPatientSuccess,
  updatePatientStart,
  updatePatientSuccess,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchPatientStart())
  const patient = await PatientRepository.find(id)
  dispatch(fetchPatientSuccess(patient))
}

export const createPatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())
  const newPatient = await PatientRepository.save(patient)
  dispatch(createPatientSuccess())

  if (onSuccess) {
    onSuccess(newPatient)
  }
}

export const updatePatient = (
  patient: Patient,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())
  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))

  if (onSuccess) {
    onSuccess(updatedPatient)
  }
}

export const addRelatedPerson = (
  patientId: string,
  relatedPerson: RelatedPerson,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  relatedPerson.id = uuid()
  const patient = await PatientRepository.find(patientId)
  const relatedPersons = patient.relatedPersons || []
  relatedPersons.push(relatedPerson)
  patient.relatedPersons = relatedPersons

  await dispatch(updatePatient(patient, onSuccess))
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

export const addDiagnosis = (
  patientId: string,
  diagnosis: Diagnosis,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  diagnosis.id = uuid()
  const patient = await PatientRepository.find(patientId)
  const diagnoses = patient.diagnoses || []
  diagnoses.push(diagnosis)
  patient.diagnoses = diagnoses

  await dispatch(updatePatient(patient, onSuccess))
}

export const addAllergy = (
  patientId: string,
  allergy: Allergy,
  onSuccess?: (patient: Patient) => void,
): AppThunk => async (dispatch) => {
  allergy.id = uuid()
  const patient = await PatientRepository.find(patientId)
  const allergies = patient.allergies || []
  allergies.push(allergy)
  patient.allergies = allergies

  await dispatch(updatePatient(patient, onSuccess))
}

export default patientSlice.reducer
