import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import LabRepository from 'clients/db/LabRepository'
import SortRequest from 'clients/db/SortRequest'
import Lab from 'model/Lab'
import { AppThunk } from 'store'

interface LabsState {
  isLoading: boolean
  labs: Lab[]
  statusFilter: status
}

type status = 'requested' | 'completed' | 'canceled' | 'all'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const initialState: LabsState = {
  isLoading: false,
  labs: [],
  statusFilter: 'all',
}

const startLoading = (state: LabsState) => {
  state.isLoading = true
}

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    fetchLabsStart: startLoading,
    fetchLabsSuccess(state, { payload }: PayloadAction<Lab[]>) {
      state.isLoading = false
      state.labs = payload
    },
  },
})
export const { fetchLabsStart, fetchLabsSuccess } = labsSlice.actions

export const searchLabs = (text: string, status: status): AppThunk => async (dispatch) => {
  dispatch(fetchLabsStart())

  let labs

  if (text.trim() === '' && status === initialState.statusFilter) {
    labs = await LabRepository.findAll(defaultSortRequest)
  } else {
    labs = await LabRepository.search({
      text,
      status,
      defaultSortRequest,
    })
  }

  dispatch(fetchLabsSuccess(labs))
}

export default labsSlice.reducer
