import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import ReduxThunk, { ThunkAction } from 'redux-thunk'
import patient from '../patients/patient-slice'
import patients from '../patients/patients-slice'
import appointment from '../scheduling/appointments/appointment-slice'
import appointments from '../scheduling/appointments/appointments-slice'
import title from '../page-header/title-slice'
import user from '../user/user-slice'
import lab from '../labs/lab-slice'
import breadcrumbs from '../breadcrumbs/breadcrumbs-slice'
import components from '../components/component-slice'

const reducer = combineReducers({
  patient,
  patients,
  title,
  user,
  appointment,
  appointments,
  breadcrumbs,
  components,
  lab,
})

const store = configureStore({
  reducer,
  middleware: [ReduxThunk],
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootState = ReturnType<typeof reducer>

export default store
