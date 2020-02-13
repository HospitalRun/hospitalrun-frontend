import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'

interface AppointmentState {
  appointment: Appointment
  patient: Patient
  isLoading: boolean
}

const initialAppointmentState = {
  appointment: {} as Appointment,
  patient: {} as Patient,
  isLoading: false,
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: initialAppointmentState,
  reducers: {
    fetchAppointmentStart: (state: AppointmentState) => {
      state.isLoading = true
    },
    fetchAppointmentSuccess: (
      state,
      { payload }: PayloadAction<{ appointment: Appointment; patient: Patient }>,
    ) => {
      state.isLoading = false
      state.appointment = payload.appointment
      state.patient = payload.patient
    },
  },
})

export const { fetchAppointmentStart, fetchAppointmentSuccess } = appointmentSlice.actions

export const fetchAppointment = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentStart())
  const appointment = await AppointmentRepository.find(id)
  const patient = await PatientRepository.find(appointment.patientId)

  dispatch(fetchAppointmentSuccess({ appointment, patient }))
}

export default appointmentSlice.reducer
