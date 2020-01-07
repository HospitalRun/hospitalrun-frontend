import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../model/Patient'
import PatientRepository from '../clients/db/PatientRepository'
import { AppThunk } from '../store'
import Search from '../clients/db/Search'

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
      state.isLoading = false
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
    dispatch(createPatientSuccess())
    history.push(`/patients/${newPatient.id}`)
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

export const searchPatients = (searchString: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getPatientsStart())

    let patients
    if (searchString.trim() === '') {
      patients = await PatientRepository.findAll()
    } else {
      patients = await PatientRepository.search(new Search(searchString, ['fullName']))
    }

    dispatch(getAllPatientsSuccess(patients))
  } catch (error) {
    console.log(error)
  }
}

export default patientsSlice.reducer
