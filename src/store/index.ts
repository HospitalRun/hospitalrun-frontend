import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import ReduxThunk, { ThunkAction } from 'redux-thunk'
import patient from '../patients/patient-slice'
import patients from '../patients/patients-slice'
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
  middleware: [ReduxThunk],
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootState = ReturnType<typeof reducer>

export default store
