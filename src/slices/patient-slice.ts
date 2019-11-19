import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import * as patientsDb from '../clients/db/patients-db'
import { AppThunk } from '../store/store'

interface PatientState {
  isLoading: boolean
  isUpdated: boolean
  isCreated: boolean
  patient: Patient
}

const initialState: PatientState = {
  isLoading: false,
  isUpdated: false,
  isCreated: false,
  patient: new Patient('', '', '', ''),
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
    createPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isCreated = true
      state.patient = payload
    },
    updateStart: startLoading,
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isUpdated = true
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
  createPatientSuccess,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getPatientStart())
    const patient = await patientsDb.get(id)
    dispatch(getPatientSuccess(patient))
  } catch (error) {
    console.log(error)
  }
}

export const updatePatient = (patient: Patient): AppThunk => async (dispatch) => {
  try {
    const updatedPatient = await patientsDb.saveOrUpdate(patient)
    dispatch(updatePatientSuccess(updatedPatient))
  } catch (error) {
    console.log(error)
  }
}

export const createPatient = (patient: Patient): AppThunk => async (dispatch) => {
  try {
    const newPatient = await patientsDb.save(patient)
    dispatch(createPatientSuccess(newPatient))
  } catch (error) {
    console.log(error)
  }
}

export default patientSlice.reducer
