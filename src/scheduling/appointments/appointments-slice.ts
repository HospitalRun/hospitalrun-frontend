import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentRepository'

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

export const fetchPatientAppointments = (
  patientId: string,
  searchString?: string,
): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentsStart())

  let appointments
  if (searchString === undefined || searchString.trim() === '') {
    const query = { selector: { patientId } }
    appointments = await AppointmentRepository.search(query)
  } else {
    appointments = await AppointmentRepository.searchPatientAppointments(patientId, searchString)
  }

  dispatch(fetchAppointmentsSuccess(appointments))
}

export default appointmentsSlice.reducer
