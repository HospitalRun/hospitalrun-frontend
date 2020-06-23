import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isBefore } from 'date-fns'
import _ from 'lodash'

import AppointmentRepository from '../../clients/db/AppointmentRepository'
import PatientRepository from '../../clients/db/PatientRepository'
import Appointment from '../../model/Appointment'
import Patient from '../../model/Patient'
import { AppThunk } from '../../store'

function validateAppointment(appointment: Appointment) {
  const err: Error = {}

  if (!appointment.patient) {
    err.patient = 'scheduling.appointment.errors.patientRequired'
  }

  if (isBefore(new Date(appointment.endDateTime), new Date(appointment.startDateTime))) {
    err.startDateTime = 'scheduling.appointment.errors.startDateMustBeBeforeEndDate'
  }

  return err
}

interface Error {
  patient?: string
  startDateTime?: string
  message?: string
}

interface AppointmentState {
  error: Error
  appointment: Appointment
  patient: Patient
  status: 'loading' | 'error' | 'completed'
}

const initialState: AppointmentState = {
  error: {},
  appointment: {} as Appointment,
  patient: {} as Patient,
  status: 'loading',
}

function start(state: AppointmentState) {
  state.status = 'loading'
}

function finish(state: AppointmentState, { payload }: PayloadAction<Appointment>) {
  state.status = 'completed'
  state.appointment = payload
  state.error = {}
}

function error(state: AppointmentState, { payload }: PayloadAction<Error>) {
  state.status = 'error'
  state.error = payload
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    fetchAppointmentStart: start,
    fetchAppointmentSuccess: (
      state: AppointmentState,
      { payload }: PayloadAction<{ appointment: Appointment; patient: Patient }>,
    ) => {
      state.status = 'completed'
      state.appointment = payload.appointment
      state.patient = payload.patient
    },
    createAppointmentStart: start,
    createAppointmentSuccess(state) {
      state.status = 'completed'
    },
    createAppointmentError: error,
    updateAppointmentStart: start,
    updateAppointmentSuccess: finish,
    updateAppointmentError: error,
    deleteAppointmentStart: start,
    deleteAppointmentSuccess(state) {
      state.status = 'completed'
    },
  },
})

export const {
  createAppointmentStart,
  createAppointmentSuccess,
  createAppointmentError,
  updateAppointmentStart,
  updateAppointmentSuccess,
  updateAppointmentError,
  fetchAppointmentStart,
  fetchAppointmentSuccess,
  deleteAppointmentStart,
  deleteAppointmentSuccess,
} = appointmentSlice.actions

export const fetchAppointment = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentStart())
  const appointment = await AppointmentRepository.find(id)
  const patient = await PatientRepository.find(appointment.patient)

  dispatch(fetchAppointmentSuccess({ appointment, patient }))
}

export const createAppointment = (
  appointment: Appointment,
  onSuccess?: (appointment: Appointment) => void,
): AppThunk => async (dispatch) => {
  dispatch(createAppointmentStart())
  const newAppointmentError = validateAppointment(appointment)

  if (_.isEmpty(newAppointmentError)) {
    const newAppointment = await AppointmentRepository.save(appointment)
    dispatch(createAppointmentSuccess())
    if (onSuccess) {
      onSuccess(newAppointment)
    }
  } else {
    newAppointmentError.message = 'scheduling.appointment.errors.createAppointmentError'
    dispatch(createAppointmentError(newAppointmentError))
  }
}

export const updateAppointment = (
  appointment: Appointment,
  onSuccess?: (appointment: Appointment) => void,
): AppThunk => async (dispatch) => {
  dispatch(updateAppointmentStart())
  const updatedAppointmentError = validateAppointment(appointment)

  if (_.isEmpty(updatedAppointmentError)) {
    const updatedAppointment = await AppointmentRepository.saveOrUpdate(appointment)
    dispatch(updateAppointmentSuccess(updatedAppointment))

    if (onSuccess) {
      onSuccess(updatedAppointment)
    }
  } else {
    updatedAppointmentError.message = 'scheduling.appointment.errors.updateAppointmentError'
    dispatch(updateAppointmentError(updatedAppointmentError))
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
