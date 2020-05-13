import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'store'
import Incident from '../model/Incident'
import IncidentRepository from '../clients/db/IncidentRepository'

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

export const fetchIncidents = (): AppThunk => async (dispatch) => {
  dispatch(fetchIncidentsStart())

  const incidents = await IncidentRepository.findAll()

  dispatch(fetchIncidentsSuccess(incidents))
}

export default incidentSlice.reducer
