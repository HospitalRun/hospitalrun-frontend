import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import ReduxThunk, { ThunkAction } from 'redux-thunk'
import { createLogger } from 'redux-logger'

import patient from '../slices/patient-slice'
import patients from '../slices/patients-slice'
import title from '../slices/title-slice'
import user from '../slices/user-slice'

const reducer = combineReducers({
  patient,
  patients,
  title,
  user,
})

const store = configureStore({
  reducer,
  middleware: [ReduxThunk, createLogger()],
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootState = ReturnType<typeof reducer>

export default store
