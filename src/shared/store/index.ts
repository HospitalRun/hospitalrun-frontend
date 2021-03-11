import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import ReduxThunk, { ThunkAction } from 'redux-thunk'

import medication from '../../medications/medication-slice'
import breadcrumbs from '../../page-header/breadcrumbs/breadcrumbs-slice'
import patient from '../../patients/patient-slice'
import patients from '../../patients/patients-slice'
import user from '../../user/user-slice'
import components from '../components/component-slice'

const reducer = combineReducers({
  patient,
  patients,
  user,
  breadcrumbs,
  components,
  medication,
})

const store = configureStore({
  reducer,
  middleware: [ReduxThunk],
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootState = ReturnType<typeof reducer>

export default store
