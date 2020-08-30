import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import ImagingRepository from '../shared/db/ImagingRepository'
import Imaging from '../shared/model/Imaging'
import Patient from '../shared/model/Patient'
import { AppThunk } from '../shared/store'

interface Error {
  patient?: string
  type?: string
  status?: string
  message?: string
  visitId?: string
}

interface ImagingState {
  error: Error
  imaging?: Imaging
  patient?: Patient
  status: 'loading' | 'error' | 'completed'
}

const statusType: string[] = ['requested', 'completed', 'canceled']

const initialState: ImagingState = {
  error: {},
  imaging: undefined,
  patient: undefined,
  status: 'loading',
}

function start(state: ImagingState) {
  state.status = 'loading'
}

function finish(state: ImagingState, { payload }: PayloadAction<Imaging>) {
  state.status = 'completed'
  state.imaging = payload
  state.error = {}
}

function error(state: ImagingState, { payload }: PayloadAction<Error>) {
  state.status = 'error'
  state.error = payload
}

const imagingSlice = createSlice({
  name: 'imaging',
  initialState,
  reducers: {
    requestImagingStart: start,
    requestImagingSuccess: finish,
    requestImagingError: error,
  },
})

export const {
  requestImagingStart,
  requestImagingSuccess,
  requestImagingError,
} = imagingSlice.actions

const validateImagingRequest = (newImaging: Imaging): Error => {
  const imagingRequestError: Error = {}
  if (!newImaging.patient) {
    imagingRequestError.patient = 'imagings.requests.error.patientRequired'
  }

  if (!newImaging.type) {
    imagingRequestError.type = 'imagings.requests.error.typeRequired'
  }

  if (!newImaging.status) {
    imagingRequestError.status = 'imagings.requests.error.statusRequired'
  } else if (!statusType.includes(newImaging.status)) {
    imagingRequestError.status = 'imagings.requests.error.incorrectStatus'
  }

  return imagingRequestError
}

export const requestImaging = (
  newImaging: Imaging,
  onSuccess?: (imaging: Imaging) => void,
): AppThunk => async (dispatch, getState) => {
  dispatch(requestImagingStart())

  const imagingRequestError = validateImagingRequest(newImaging)
  if (Object.keys(imagingRequestError).length > 0) {
    imagingRequestError.message = 'imagings.requests.error.unableToRequest'
    dispatch(requestImagingError(imagingRequestError))
  } else {
    newImaging.requestedOn = new Date(Date.now().valueOf()).toISOString()
    newImaging.requestedBy = getState().user.user?.id || ''
    const requestedImaging = await ImagingRepository.save(newImaging)
    dispatch(requestImagingSuccess(requestedImaging))

    if (onSuccess) {
      onSuccess(requestedImaging)
    }
  }
}

export default imagingSlice.reducer
