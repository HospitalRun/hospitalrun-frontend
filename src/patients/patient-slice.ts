import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'

interface PatientState {
  isLoading: boolean
  isUpdatedSuccessfully: boolean
  patient: Patient
}

const initialState: PatientState = {
  isLoading: false,
  isUpdatedSuccessfully: false,
  patient: {} as Patient,
}

function startLoading(state: PatientState) {
  state.isLoading = true
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    getPatientStart: startLoading,
    getPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
    updateStart: startLoading,
  },
})

export const {
  getPatientStart,
  getPatientSuccess,
  updateStart,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(getPatientStart())
  const patient = await PatientRepository.find(id)
  dispatch(getPatientSuccess(patient))
}

export default patientSlice.reducer
