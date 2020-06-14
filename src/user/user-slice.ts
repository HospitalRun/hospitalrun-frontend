import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { remoteDb } from '../config/pouchdb'
import Permissions from '../model/Permissions'
import User from '../model/User'
import { AppThunk } from '../store'

interface UserState {
  permissions: (Permissions | null)[]
  user?: User
  loginError?: string
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
    Permissions.ReadCarePlan,
  ],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchPermissions(state, { payload }: PayloadAction<Permissions[]>) {
      state.permissions = payload
    },
    loginSuccess(state, { payload }: PayloadAction<User>) {
      state.user = payload
    },
    loginError(state, { payload }: PayloadAction<string>) {
      state.loginError = payload
    },
    logoutSuccess(state) {
      state.user = undefined
    },
  },
})

export const { fetchPermissions, loginError, loginSuccess, logoutSuccess } = userSlice.actions

export const getCurrentSession = (username: string): AppThunk => async (dispatch) => {
  const user = await remoteDb.getUser(username)
  dispatch(
    loginSuccess({
      id: user._id,
      givenName: (user as any).metadata.givenName,
      familyName: (user as any).metadata.familyName,
    }),
  )
}

export const login = (username: string, password: string): AppThunk => async (dispatch) => {
  console.log(`login ${username} : ${password}`)
  try {
    const response = await remoteDb.logIn(username, password)
    dispatch(getCurrentSession(response.name))
  } catch (error) {
    console.log(error.status)
    if (error.status === '401') {
      dispatch(loginError('Username or password is incorrect.'))
    }
  }
  console.log(dispatch)
}

export const logout = (): AppThunk => async (dispatch) => {
  await remoteDb.logOut()
  dispatch(logoutSuccess())
}

export default userSlice.reducer
