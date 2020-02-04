import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Patient from '../../model/Persons/Patient'
import PersonRepository from '../../clients/db/PersonRepository'
import { AppThunk } from '../../store'

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
    getPatientStart: startLoading,
    updatePatientStart: startLoading,
    getPatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
    updatePatientSuccess(state, { payload }: PayloadAction<Patient>) {
      state.isLoading = false
      state.patient = payload
    },
  },
})

export const {
  getPatientStart,
  getPatientSuccess,
  updatePatientStart,
  updatePatientSuccess,
} = patientSlice.actions

export const fetchPatient = (id: string): AppThunk => async (dispatch) => {
  dispatch(getPatientStart())
  const patient = await PersonRepository.find(id)
  dispatch(getPatientSuccess(patient))
}

export const updatePatient = (patient: Patient): AppThunk => async (dispatch) => {
  dispatch(updatePatientStart())
  const updatedPatient = await PersonRepository.saveOrUpdate(patient)
  dispatch(updatePatientSuccess(updatedPatient))
}

export default patientSlice.reducer
