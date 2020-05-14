import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../store'

interface TitleState {
  title: string
}

const initialState: TitleState = {
  title: '',
}

const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    changeTitle(state, { payload }: PayloadAction<string>) {
      state.title = payload
    },
  },
})

export const { changeTitle } = titleSlice.actions

export const updateTitle = (title: string): AppThunk => async (dispatch) => {
  dispatch(changeTitle(title))
}

export default titleSlice.reducer
