import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import { Toast } from '@hospitalrun/components'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import il8n from '../../i18n'

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
    deleteAppointmentStart: (state: AppointmentState) => {
      state.isLoading = true
    },
    deleteAppointmentSuccess: (state: AppointmentState) => {
      state.isLoading = false
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

export const {
  fetchAppointmentStart,
  fetchAppointmentSuccess,
  deleteAppointmentStart,
  deleteAppointmentSuccess,
} = appointmentSlice.actions

export const fetchAppointment = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentStart())
  const appointment = await AppointmentRepository.find(id)
  const patient = await PatientRepository.find(appointment.patientId)

  dispatch(fetchAppointmentSuccess({ appointment, patient }))
}

export const deleteAppointment = (appointment: Appointment, history: any): AppThunk => async (
  dispatch,
) => {
  dispatch(deleteAppointmentStart())
  await AppointmentRepository.delete(appointment)
  history.push('/appointments')
  Toast(
    'success',
    il8n.t('states.success'),
    `${il8n.t('scheduling.appointments.successfullyDeleted')}`,
  )
  dispatch(deleteAppointmentSuccess())
}

export default appointmentSlice.reducer
