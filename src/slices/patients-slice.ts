import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store/store'

interface PatientsState {
  isLoading: boolean
  patients: Patient[]
}

const initialState: PatientsState = {
  isLoading: false,
  patients: [],
}

function startLoading(state: PatientsState) {
  state.isLoading = true
}

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    getPatientsStart: startLoading,
    createPatientStart: startLoading,
    getAllPatientsSuccess(state, { payload }: PayloadAction<Patient[]>) {
      state.isLoading = false
      state.patients = payload
    },
    createPatientSuccess(state) {
      state.isLoading = true
    },
  },
})

export const {
  getPatientsStart,
  getAllPatientsSuccess,
  createPatientStart,
  createPatientSuccess,
} = patientsSlice.actions

export const createPatient = (patient: Patient, history: any): AppThunk => async (dispatch) => {
  try {
    dispatch(createPatientStart())
    const newPatient = await PatientRepository.save(patient)
    history.push(newPatient.id)
  } catch (error) {
    console.log(error)
  }
}

export const fetchPatients = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getPatientsStart())
    const patients = await PatientRepository.findAll()
    dispatch(getAllPatientsSuccess(patients))
  } catch (error) {
    console.log(error)
  }
}

export default patientsSlice.reducer
