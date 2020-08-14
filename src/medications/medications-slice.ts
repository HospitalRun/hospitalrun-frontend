import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import MedicationRepository from '../shared/db/MedicationRepository'
import SortRequest from '../shared/db/SortRequest'
import Medication from '../shared/model/Medication'
import { AppThunk } from '../shared/store'

interface MedicationsState {
  isLoading: boolean
  medications: Medication[]
  statusFilter: status
}

type status =
  | 'draft'
  | 'active'
  | 'on hold'
  | 'canceled'
  | 'completed'
  | 'entered in error'
  | 'stopped'
  | 'unknown'
  | 'all'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const initialState: MedicationsState = {
  isLoading: false,
  medications: [],
  statusFilter: 'all',
}

const startLoading = (state: MedicationsState) => {
  state.isLoading = true
}

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    fetchMedicationsStart: startLoading,
    fetchMedicationsSuccess(state, { payload }: PayloadAction<Medication[]>) {
      state.isLoading = false
      state.medications = payload
    },
  },
})
export const { fetchMedicationsStart, fetchMedicationsSuccess } = medicationsSlice.actions

export const searchMedications = (text: string, status: status): AppThunk => async (dispatch) => {
  dispatch(fetchMedicationsStart())

  let medications

  if (text.trim() === '' && status === initialState.statusFilter) {
    medications = await MedicationRepository.findAll(defaultSortRequest)
  } else {
    medications = await MedicationRepository.search({
      text,
      status,
      defaultSortRequest,
    })
  }

  dispatch(fetchMedicationsSuccess(medications))
}

export default medicationsSlice.reducer
