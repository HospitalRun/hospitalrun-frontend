import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Toast } from '@hospitalrun/components'
import Patient from '../model/Patient'
import PersonRepository from '../clients/db/PersonRepository'
import { AppThunk } from '../store'
import il8n from '../i18n'

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
  dispatch(createPatientStart())
  const newPatient = await PersonRepository.save(patient)
  dispatch(createPatientSuccess())
  history.push(`/patients/${newPatient.id}`)
  Toast(
    'success',
    il8n.t('Success!'),
    `${il8n.t('patients.successfullyCreated')} ${patient.givenName} ${patient.familyName} ${
      patient.suffix
    }`,
  )
}

export const fetchPatients = (): AppThunk => async (dispatch) => {
  dispatch(getPatientsStart())
  const patients = await PersonRepository.findAll()
  dispatch(getAllPatientsSuccess(patients))
}

export const searchPatients = (searchString: string): AppThunk => async (dispatch) => {
  dispatch(getPatientsStart())

  let patients
  if (searchString.trim() === '') {
    patients = await PersonRepository.findAll()
  } else {
    patients = await PersonRepository.search(searchString)
  }

  dispatch(getAllPatientsSuccess(patients))
}

export default patientsSlice.reducer
