import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import * as patientsDb from '../clients/db/patients-db'
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
    getAllPatientsSuccess(state, { payload }: PayloadAction<Patient[]>) {
      state.isLoading = false
      state.patients = payload
    },
  },
})

export const { getPatientsStart, getAllPatientsSuccess } = patientsSlice.actions

export const fetchPatients = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getPatientsStart())
    const patients = await patientsDb.getAll()
    dispatch(getAllPatientsSuccess(patients))
  } catch (error) {
    console.log(error)
  }
}

export default patientsSlice.reducer
