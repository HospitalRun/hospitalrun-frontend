import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentsRepository'

interface AppointmentState {
  appointment: Appointment
  isLoading: boolean
}

const initialAppointmentState = {
  appointment: {} as Appointment,
  isLoading: false,
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: initialAppointmentState,
  reducers: {
    getAppointmentStart: (state: AppointmentState) => {
      state.isLoading = true
    },
    getAppointmentSuccess: (state, { payload }: PayloadAction<Appointment>) => {
      state.isLoading = false
      state.appointment = payload
    },
  },
})

export const { getAppointmentStart, getAppointmentSuccess } = appointmentSlice.actions

export const fetchAppointment = (id: string): AppThunk => async (dispatch) => {
  dispatch(getAppointmentStart())
  const appointments = await AppointmentRepository.find(id)
  dispatch(getAppointmentSuccess(appointments))
}

export default appointmentSlice.reducer
