import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../store'
import { IconType } from '@hospitalrun/components/dist/components/Icon/interfaces'


interface ButtonState {
    text: string,
    link: string,
    visible: string,
    icon: IconType
}

const initialState: ButtonState = {
    text: '',
    link: '',
    visible: 'none',
    icon: 'add'
}

const ButtonSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        changeText(state, { payload }: PayloadAction<string>) {
            state.text = payload
        },
        changeLink(state, { payload }: PayloadAction<string>) {
            state.link = payload
        },
        changeVisibility(state, { payload }: PayloadAction<boolean>) {
            if (payload) {
                state.visible = ''
            }
            else {
                state.visible = 'none'
            }

        },
        changeIcon(state, { payload }: PayloadAction<IconType>) {
            state.icon = payload
        },
    },
}
)

export const { changeLink } = ButtonSlice.actions

export const { changeText } = ButtonSlice.actions

export const { changeVisibility } = ButtonSlice.actions

export const { changeIcon } = ButtonSlice.actions

export const updateText = (text: string): AppThunk => async (dispatch) => {
    dispatch(changeText(text))
}
export const updateLink = (link: string): AppThunk => async (dispatch) => {
    dispatch(changeLink(link))
}
export const updateVisibility = (visible: boolean): AppThunk => async (dispatch) => {
    dispatch(changeVisibility(visible))
}

export const updateIcon = (icon: IconType): AppThunk => async (dispatch) => {
    dispatch(changeIcon(icon))
}
export default ButtonSlice.reducer
