import Lab from 'model/Lab'
import Patient from 'model/Patient'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'store'
import LabRepository from 'clients/db/LabRepository'
import PatientRepository from 'clients/db/PatientRepository'

interface Error {
  result?: string
  patient?: string
  type?: string
  message?: string
}

interface LabState {
  error: Error
  lab?: Lab
  patient?: Patient
  status: 'loading' | 'error' | 'success'
}

const initialState: LabState = {
  error: {},
  lab: undefined,
  patient: undefined,
  status: 'loading',
}

function start(state: LabState) {
  state.status = 'loading'
}

function finish(state: LabState, { payload }: PayloadAction<Lab>) {
  state.status = 'success'
  state.lab = payload
  state.error = {}
}

function error(state: LabState, { payload }: PayloadAction<Error>) {
  state.status = 'error'
  state.error = payload
}

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    fetchLabStart: start,
    fetchLabSuccess: (
      state: LabState,
      { payload }: PayloadAction<{ lab: Lab; patient: Patient }>,
    ) => {
      state.status = 'success'
      state.lab = payload.lab
      state.patient = payload.patient
    },
    updateLabStart: start,
    updateLabSuccess: finish,
    requestLabStart: start,
    requestLabSuccess: finish,
    requestLabError: error,
    cancelLabStart: start,
    cancelLabSuccess: finish,
    completeLabStart: start,
    completeLabSuccess: finish,
    completeLabError: error,
  },
})

export const {
  fetchLabStart,
  fetchLabSuccess,
  updateLabStart,
  updateLabSuccess,
  requestLabStart,
  requestLabSuccess,
  requestLabError,
  cancelLabStart,
  cancelLabSuccess,
  completeLabStart,
  completeLabSuccess,
  completeLabError,
} = labSlice.actions

export const fetchLab = (labId: string): AppThunk => async (dispatch) => {
  dispatch(fetchLabStart())
  const fetchedLab = await LabRepository.find(labId)
  const fetchedPatient = await PatientRepository.find(fetchedLab.patientId)
  dispatch(fetchLabSuccess({ lab: fetchedLab, patient: fetchedPatient }))
}

const validateLabRequest = (newLab: Lab): Error => {
  const labRequestError: Error = {}
  if (!newLab.patientId) {
    labRequestError.patient = 'labs.requests.error.patientRequired'
  }

  if (!newLab.type) {
    labRequestError.type = 'labs.requests.error.typeRequired'
  }

  return labRequestError
}

export const requestLab = (newLab: Lab, onSuccess?: (lab: Lab) => void): AppThunk => async (
  dispatch,
) => {
  dispatch(requestLabStart())

  const labRequestError = validateLabRequest(newLab)
  if (Object.keys(labRequestError).length > 0) {
    labRequestError.message = 'labs.requests.error.unableToRequest'
    dispatch(requestLabError(labRequestError))
  } else {
    newLab.status = 'requested'
    newLab.requestedOn = new Date(Date.now().valueOf()).toISOString()
    const requestedLab = await LabRepository.save(newLab)
    dispatch(requestLabSuccess(requestedLab))

    if (onSuccess) {
      onSuccess(requestedLab)
    }
  }
}

export const cancelLab = (labToCancel: Lab, onSuccess?: (lab: Lab) => void): AppThunk => async (
  dispatch,
) => {
  dispatch(cancelLabStart())

  labToCancel.canceledOn = new Date(Date.now().valueOf()).toISOString()
  labToCancel.status = 'canceled'
  const canceledLab = await LabRepository.saveOrUpdate(labToCancel)
  dispatch(cancelLabSuccess(canceledLab))

  if (onSuccess) {
    onSuccess(canceledLab)
  }
}

const validateCompleteLab = (labToComplete: Lab): Error => {
  const completeError: Error = {}

  if (!labToComplete.result) {
    completeError.result = 'labs.requests.error.resultRequiredToComplete'
  }

  return completeError
}

export const completeLab = (labToComplete: Lab, onSuccess?: (lab: Lab) => void): AppThunk => async (
  dispatch,
) => {
  dispatch(completeLabStart())

  const completeLabErrors = validateCompleteLab(labToComplete)
  if (Object.keys(completeLabErrors).length > 0) {
    completeLabErrors.message = 'labs.requests.error.unableToComplete'
    dispatch(completeLabError(completeLabErrors))
  } else {
    labToComplete.completedOn = new Date(Date.now().valueOf()).toISOString()
    labToComplete.status = 'completed'
    const completedLab = await LabRepository.saveOrUpdate(labToComplete)
    dispatch(completeLabSuccess(completedLab))

    if (onSuccess) {
      onSuccess(completedLab)
    }
  }
}

export const updateLab = (labToUpdate: Lab, onSuccess?: (lab: Lab) => void): AppThunk => async (
  dispatch,
) => {
  dispatch(updateLabStart())
  const updatedLab = await LabRepository.saveOrUpdate(labToUpdate)
  dispatch(updateLabSuccess(updatedLab))

  if (onSuccess) {
    onSuccess(updatedLab)
  }
}

export default labSlice.reducer
