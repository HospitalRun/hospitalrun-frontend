import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Toast } from '@hospitalrun/components'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'
import il8n from '../i18n'

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

export const createPatient = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  dispatch(createPatientStart())
  const newPatient = await PatientRepository.save(patient)
  dispatch(createPatientSuccess())
  history.push(`/patients/${newPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyCreated')} ${patient.fullName}`,
  )
}

export const updatePatient = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())
  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
  history.push(`/patients/${updatedPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyUpdated')} ${patient.fullName}`,
  )
}

export const addRelatedPerson = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())
  const updatedPatient = await PatientRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
  history.push(`/patients/${updatedPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyUpdated')} ${patient.fullName}`,
  )
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyAddedRelatedPerson')}`,
    'top-left',
  )
}

export default patientSlice.reducer
