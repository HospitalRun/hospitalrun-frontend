import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import ImagingRepository from '../shared/db/ImagingRepository'
import SortRequest from '../shared/db/SortRequest'
import Imaging from '../shared/model/Imaging'
import { AppThunk } from '../shared/store'

interface ImagingsState {
  isLoading: boolean
  imagings: Imaging[]
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

const initialState: ImagingsState = {
  isLoading: false,
  imagings: [],
  statusFilter: 'all',
}

const startLoading = (state: ImagingsState) => {
  state.isLoading = true
}

const imagingsSlice = createSlice({
  name: 'imagings',
  initialState,
  reducers: {
    fetchImagingsStart: startLoading,
    fetchImagingsSuccess(state, { payload }: PayloadAction<Imaging[]>) {
      state.isLoading = false
      state.imagings = payload
    },
  },
})
export const { fetchImagingsStart, fetchImagingsSuccess } = imagingsSlice.actions

export const searchImagings = (text: string, status: status): AppThunk => async (dispatch) => {
  dispatch(fetchImagingsStart())

  let imagings

  if (text.trim() === '' && status === initialState.statusFilter) {
    imagings = await ImagingRepository.findAll(defaultSortRequest)
  } else {
    imagings = await ImagingRepository.search({
      text,
      status,
      defaultSortRequest,
    })
  }

  dispatch(fetchImagingsSuccess(imagings))
}

export default imagingsSlice.reducer
