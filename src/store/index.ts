import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import ReduxThunk, { ThunkAction } from 'redux-thunk'
import patient from '../patients/patient-slice'
import patients from '../patients/patients-slice'
import title from '../page-header/title-slice'
import user from '../user/user-slice'
import text from '../page-header/button-slice'
import link from '../page-header/button-slice'
import visible from '../page-header/button-slice'
import icon from '../page-header/button-slice'

const reducer = combineReducers({
  patient,
  patients,
  title,
  user,
  text,
  link,
  visible,
  icon
})

const store = configureStore({
  reducer,
  middleware: [ReduxThunk],
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootState = ReturnType<typeof reducer>

export default store
