import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import AppointmentRepository from '../../clients/db/AppointmentRepository'
import PatientRepository from '../../clients/db/PatientRepository'
import Appointment from '../../model/Appointment'
import { AppThunk } from '../../store'

interface AppointmentsState {
  isLoading: boolean
  appointments: Appointment[]
}

const initialState: AppointmentsState = {
  isLoading: false,
  appointments: [],
}

function startLoading(state: AppointmentsState) {
  state.isLoading = true
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart: startLoading,
    fetchAppointmentsSuccess: (state, { payload }: PayloadAction<Appointment[]>) => {
      state.isLoading = false
      state.appointments = payload
    },
  },
})

export const { fetchAppointmentsStart, fetchAppointmentsSuccess } = appointmentsSlice.actions

export const fetchAppointments = (): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentsStart())
  const appointments = await AppointmentRepository.findAll()
  dispatch(fetchAppointmentsSuccess(appointments))
}

export const fetchPatientAppointments = (patientId: string): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentsStart())

  const appointments = await PatientRepository.getAppointments(patientId)
  console.log(appointments)

  dispatch(fetchAppointmentsSuccess(appointments))
}

export default appointmentsSlice.reducer
