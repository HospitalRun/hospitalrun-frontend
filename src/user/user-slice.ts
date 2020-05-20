import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Permissions from '../model/Permissions'
import User from '../model/User'

interface UserState {
  permissions: Permissions[]
  user: User
}

const initialState: UserState = {
  permissions: [
    Permissions.ReadPatients,
    Permissions.WritePatients,
    Permissions.ReadAppointments,
    Permissions.WriteAppointments,
    Permissions.DeleteAppointment,
    Permissions.AddAllergy,
    Permissions.AddDiagnosis,
    Permissions.ViewLabs,
    Permissions.ViewLab,
    Permissions.RequestLab,
    Permissions.CompleteLab,
    Permissions.CancelLab,
    Permissions.ViewIncident,
    Permissions.ViewIncidents,
    Permissions.ReportIncident,
    Permissions.AddCarePlan,
    Permissions.ReadCarePlan
  ],
  user: {
    id: 'some-hardcoded-id',
    givenName: 'HospitalRun',
    familyName: 'Fake User',
  } as User,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchPermissions(state, { payload }: PayloadAction<Permissions[]>) {
      state.permissions = payload
    },
  },
})

export const { fetchPermissions } = userSlice.actions

export default userSlice.reducer
