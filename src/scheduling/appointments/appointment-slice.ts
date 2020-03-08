import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentRepository'
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

function startLoading(state: AppointmentState) {
  state.isLoading = true
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: initialAppointmentState,
  reducers: {
    fetchAppointmentStart: startLoading,
    createAppointmentStart: startLoading,
    updateAppointmentStart: startLoading,
    deleteAppointmentStart: startLoading,
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
    createAppointmentSuccess(state) {
      state.isLoading = false
    },
    updateAppointmentSuccess(state, { payload }: PayloadAction<Appointment>) {
      state.isLoading = false
      state.appointment = payload
    },
  },
})

export const {
  createAppointmentStart,
  createAppointmentSuccess,
  updateAppointmentStart,
  updateAppointmentSuccess,
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

export const createAppointment = (
  appointment: Appointment,
  onSuccess?: (appointment: Appointment) => void,
): AppThunk => async (dispatch) => {
  dispatch(createAppointmentStart())
  const newAppointment = await AppointmentRepository.save(appointment)
  dispatch(createAppointmentSuccess())
  if (onSuccess) {
    onSuccess(newAppointment)
  }
}

export const updateAppointment = (
  appointment: Appointment,
  onSuccess?: (appointment: Appointment) => void,
): AppThunk => async (dispatch) => {
  dispatch(updateAppointmentStart())
  const updatedAppointment = await AppointmentRepository.saveOrUpdate(appointment)
  dispatch(updateAppointmentSuccess(updatedAppointment))

  if (onSuccess) {
    onSuccess(updatedAppointment)
  }
}

export const deleteAppointment = (
  appointment: Appointment,
  onSuccess?: () => void,
): AppThunk => async (dispatch) => {
  dispatch(deleteAppointmentStart())
  await AppointmentRepository.delete(appointment)
  dispatch(deleteAppointmentSuccess())

  if (onSuccess) {
    onSuccess()
  }
}

export default appointmentSlice.reducer
