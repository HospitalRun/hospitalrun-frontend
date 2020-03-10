import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from '../store'

interface ComponentState {
  sidebarCollapsed: boolean
}

const initialState: ComponentState = {
  sidebarCollapsed: false,
}

const componentSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
  },
})

export const { toggleSidebar } = componentSlice.actions

export const updateSidebar = (): AppThunk => async (dispatch) => {
  dispatch(toggleSidebar())
}

export default componentSlice.reducer
