import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import LabRepository from '../clients/db/LabRepository'
import PageRequest, { UnpagedRequest } from '../clients/db/PageRequest'
import SortRequest from '../clients/db/SortRequest'
import Page from '../clients/Page'
import Lab from '../model/Lab'
import { AppThunk } from '../store'

interface LabsState {
  isLoading: boolean
  labs: Page<Lab>
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
  labs: {
    content: [],
    hasNext: false,
    hasPrevious: false,
  } as Page<Lab>,
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
    fetchLabsSuccess(state, { payload }: PayloadAction<Page<Lab>>) {
      state.isLoading = false
      state.labs = payload
    },
  },
})
export const { fetchLabsStart, fetchLabsSuccess } = labsSlice.actions

export const searchLabs = (
  text: string,
  status: status,
  userPageRequest: PageRequest = UnpagedRequest,
): AppThunk => async (dispatch) => {
  dispatch(fetchLabsStart())

  let labs: Page<Lab>

  if (text.trim() === '' && status === initialState.statusFilter) {
    labs = await LabRepository.findAllPaged(defaultSortRequest, userPageRequest)
  } else {
    labs = await LabRepository.searchPaged(
      {
        text,
        status,
        defaultSortRequest,
      },
      userPageRequest,
    )
  }
  dispatch(fetchLabsSuccess(labs))
}

export default labsSlice.reducer
