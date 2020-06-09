import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isAfter } from 'date-fns'
import { isEmpty } from 'lodash'
import shortid from 'shortid'

import IncidentRepository from '../clients/db/IncidentRepository'
import Incident from '../model/Incident'
import { AppThunk } from '../store'

interface Error {
  date?: string
  department?: string
  category?: string
  categoryItem?: string
  description?: string
}

interface IncidentState {
  error?: Error
  incident?: Incident
  status: 'loading' | 'error' | 'completed'
}

const initialState: IncidentState = {
  error: undefined,
  incident: undefined,
  status: 'loading',
}

function start(state: IncidentState) {
  state.status = 'loading'
}

function finish(state: IncidentState, { payload }: PayloadAction<Incident>) {
  state.status = 'completed'
  state.incident = payload
  state.error = undefined
}

function error(state: IncidentState, { payload }: PayloadAction<Error>) {
  state.status = 'error'
  state.error = payload
}

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    fetchIncidentStart: start,
    fetchIncidentSuccess: finish,
    reportIncidentStart: start,
    reportIncidentSuccess: finish,
    reportIncidentError: error,
  },
})

export const {
  fetchIncidentStart,
  fetchIncidentSuccess,
  reportIncidentStart,
  reportIncidentSuccess,
  reportIncidentError,
} = incidentSlice.actions

export const fetchIncident = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchIncidentStart())
  const incident = await IncidentRepository.find(id)
  dispatch(fetchIncidentSuccess(incident))
}

function validateIncident(incident: Incident): Error {
  const newError: Error = {}

  if (!incident.date) {
    newError.date = 'incidents.reports.error.dateRequired'
  } else if (isAfter(new Date(incident.date), new Date(Date.now()))) {
    newError.date = 'incidents.reports.error.dateMustBeInThePast'
  }

  if (!incident.department) {
    newError.department = 'incidents.reports.error.departmentRequired'
  }

  if (!incident.category) {
    newError.category = 'incidents.reports.error.categoryRequired'
  }

  if (!incident.categoryItem) {
    newError.categoryItem = 'incidents.reports.error.categoryItemRequired'
  }

  if (!incident.description) {
    newError.description = 'incidents.reports.error.descriptionRequired'
  }

  return newError
}

const formatIncidentCode = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`
const getIncidentCode = (): string => formatIncidentCode('I-', shortid.generate())

export const reportIncident = (
  incident: Incident,
  onSuccess?: (incident: Incident) => void,
): AppThunk => async (dispatch, getState) => {
  dispatch(reportIncidentStart())
  const incidentError = validateIncident(incident)
  if (isEmpty(incidentError)) {
    incident.reportedOn = new Date(Date.now()).toISOString()
    incident.code = getIncidentCode()
    incident.reportedBy = getState().user.user.id
    incident.status = 'reported'
    const newIncident = await IncidentRepository.save(incident)
    await dispatch(reportIncidentSuccess(newIncident))
    if (onSuccess) {
      onSuccess(newIncident)
    }
  } else {
    dispatch(reportIncidentError(incidentError))
  }
}

export default incidentSlice.reducer
