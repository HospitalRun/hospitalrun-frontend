import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import IncidentRepository from '../clients/db/IncidentRepository'
import Incident from '../model/Incident'
import { AppThunk } from '../store'
import IncidentFilter from './IncidentFilter'

interface IncidentsState {
  incidents: Incident[]
  status: 'loading' | 'completed'
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

export const searchIncidents = (status: IncidentFilter): AppThunk => async (dispatch) => {
  dispatch(fetchIncidentsStart())
  let incidents
  if (status === IncidentFilter.all) {
    incidents = await IncidentRepository.findAll()
  } else {
    incidents = await IncidentRepository.search({
      status,
    })
  }

  dispatch(fetchIncidentsSuccess(incidents))
}

export default incidentSlice.reducer
