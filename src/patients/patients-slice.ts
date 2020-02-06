import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'

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
  dispatch(getPatientsStart())
  const patients = await PatientRepository.findAll()
  dispatch(getAllPatientsSuccess(patients))
}

export const searchPatients = (searchString: string): AppThunk => async (dispatch) => {
  dispatch(getPatientsStart())

  let patients
  if (searchString.trim() === '') {
    patients = await PatientRepository.findAll()
  } else {
    patients = await PatientRepository.search(searchString)
  }

  dispatch(getAllPatientsSuccess(patients))
}

export default patientsSlice.reducer
