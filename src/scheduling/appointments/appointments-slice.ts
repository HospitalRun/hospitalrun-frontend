import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentsRepository'

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
    createAppointmentStart: startLoading,
    getAppointmentsStart: startLoading,
    getAppointmentsSuccess: (state, { payload }: PayloadAction<Appointment[]>) => {
      state.isLoading = false
      state.appointments = payload
    },
  },
})

export const {
  createAppointmentStart,
  getAppointmentsStart,
  getAppointmentsSuccess,
} = appointmentsSlice.actions

export const fetchAppointments = (): AppThunk => async (dispatch) => {
  dispatch(getAppointmentsStart())
  const appointments = await AppointmentRepository.findAll()
  dispatch(getAppointmentsSuccess(appointments))
}

export const createAppointment = (appointment: Appointment, history: any): AppThunk => async (
  dispatch,
) => {
  dispatch(createAppointmentStart())
  await AppointmentRepository.save(appointment)
  history.push('/appointments')
}

export default appointmentsSlice.reducer
