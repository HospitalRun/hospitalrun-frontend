import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import Name from '../model/Name'
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
  patient: new Patient('', '', new Name('', '', '', ''), ''),
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
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isUpdatedSuccessfully = true
      state.isLoading = false
      state.patient = payload
    },
  },
})

export const {
  getPatientStart,
  getPatientSuccess,
  updateStart,
  updatePatientSuccess,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getPatientStart())
    const patient = await PatientRepository.find(id)
    dispatch(getPatientSuccess(patient))
  } catch (error) {
    console.log(error)
  }
}

export const updatePatient = (patient: Patient): AppThunk => async (dispatch) => {
  try {
    const updatedPatient = await PatientRepository.saveOrUpdate(patient)
    dispatch(updatePatientSuccess(updatedPatient))
  } catch (error) {
    console.log(error)
  }
}

export default patientSlice.reducer
