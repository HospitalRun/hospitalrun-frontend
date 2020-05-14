import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Permissions from '../model/Permissions'

interface UserState {
  permissions: Permissions[]
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
  ],
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
