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
    fetchPatientsStart: startLoading,
    fetchPatientsSuccess(state, { payload }: PayloadAction<Patient[]>) {
      state.isLoading = false
      state.patients = payload
    },
  },
})
export const { fetchPatientsStart, fetchPatientsSuccess } = patientsSlice.actions

export const fetchPatients = (): AppThunk => async (dispatch) => {
  dispatch(fetchPatientsStart())
  const patients = await PatientRepository.findAll()
  dispatch(fetchPatientsSuccess(patients))
}

export const searchPatients = (searchString: string): AppThunk => async (dispatch) => {
  dispatch(fetchPatientsStart())

  let patients
  if (searchString.trim() === '') {
    patients = await PatientRepository.findAll()
  } else {
    patients = await PatientRepository.search(searchString)
  }

  dispatch(fetchPatientsSuccess(patients))
}

export default patientsSlice.reducer
