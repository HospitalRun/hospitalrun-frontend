import { createSlice } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentsRepository'

interface AppointmentsState {
  isLoading: boolean
}

const initialState: AppointmentsState = {
  isLoading: false,
}

function startLoading(state: AppointmentsState) {
  state.isLoading = true
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    createAppointmentStart: startLoading,
  },
})

export const { createAppointmentStart } = appointmentsSlice.actions

export const createAppointment = (appointment: Appointment, history: any): AppThunk => async (
  dispatch,
) => {
  dispatch(createAppointmentStart())
  await AppointmentRepository.save(appointment)
  history.push('/appointments')
}

export default appointmentsSlice.reducer
