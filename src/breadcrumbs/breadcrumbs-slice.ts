import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Breadcrumb from 'model/Breadcrumb'

interface BreadcrumbsState {
  breadcrumbs: Breadcrumb[]
}

const initialState: BreadcrumbsState = {
  breadcrumbs: [],
}

const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    setBreadcrumbs(state, { payload }: PayloadAction<Breadcrumb[]>) {
      state.breadcrumbs = payload
    },
    addBreadcrumb(state, { payload }: PayloadAction<Breadcrumb>) {
      state.breadcrumbs = [...state.breadcrumbs, payload]
    },
    removeBreadcrumb(state) {
      state.breadcrumbs = state.breadcrumbs.slice(0, -1)
    },
  },
})

export const { setBreadcrumbs, addBreadcrumb, removeBreadcrumb } = breadcrumbsSlice.actions

export default breadcrumbsSlice.reducer
