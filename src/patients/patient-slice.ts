import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'

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

export default patientSlice.reducer
