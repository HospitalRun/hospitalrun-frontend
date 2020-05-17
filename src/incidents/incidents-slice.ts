import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import IncidentRepository from '../clients/db/IncidentRepository'
import Incident from '../model/Incident'
import { AppThunk } from '../store'

interface IncidentsState {
  incidents: Incident[]
  status: 'loading' | 'completed'
}

export enum filter {
  reported = 'reported',
  all = 'all',
}

const initialState: IncidentsState = {
  incidents: [],
  status: 'loading',
}

function start(state: IncidentsState) {
  state.status = 'loading'
}

function finish(state: IncidentsState, { payload }: PayloadAction<Incident[]>) {
  state.status = 'completed'
  state.incidents = payload
}

const incidentSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    fetchIncidentsStart: start,
    fetchIncidentsSuccess: finish,
  },
})

export const { fetchIncidentsStart, fetchIncidentsSuccess } = incidentSlice.actions

export const searchIncidents = (status: filter): AppThunk => async (dispatch) => {
  dispatch(fetchIncidentsStart())
  let incidents
  if (status === filter.all) {
    incidents = await IncidentRepository.findAll()
  } else {
    incidents = await IncidentRepository.search({
      status,
    })
  }

  dispatch(fetchIncidentsSuccess(incidents))
}

export default incidentSlice.reducer
