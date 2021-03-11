import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import MedicationRepository from '../shared/db/MedicationRepository'
import PatientRepository from '../shared/db/PatientRepository'
import Medication from '../shared/model/Medication'
import Patient from '../shared/model/Patient'
import { AppThunk } from '../shared/store'

interface Error {
  medication?: string
  patient?: string
  quantity?: string
  quantityValue?: string
  quantityUnit?: string
  message?: string
}

interface MedicationState {
  error: Error
  medication?: Medication
  patient?: Patient
  status: 'loading' | 'error' | 'completed'
}

const initialState: MedicationState = {
  error: {},
  medication: undefined,
  patient: undefined,
  status: 'loading',
}

function start(state: MedicationState) {
  state.status = 'loading'
}

function finish(state: MedicationState, { payload }: PayloadAction<Medication>) {
  state.status = 'completed'
  state.medication = payload
  state.error = {}
}

function error(state: MedicationState, { payload }: PayloadAction<Error>) {
  state.status = 'error'
  state.error = payload
}

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    fetchMedicationStart: start,
    fetchMedicationSuccess: (
      state: MedicationState,
      { payload }: PayloadAction<{ medication: Medication; patient: Patient }>,
    ) => {
      state.status = 'completed'
      state.medication = payload.medication
      state.patient = payload.patient
    },
    updateMedicationStart: start,
    updateMedicationSuccess: finish,
    requestMedicationStart: start,
    requestMedicationSuccess: finish,
    requestMedicationError: error,
    cancelMedicationStart: start,
    cancelMedicationSuccess: finish,
  },
})

export const {
  fetchMedicationStart,
  fetchMedicationSuccess,
  updateMedicationStart,
  updateMedicationSuccess,
  requestMedicationStart,
  requestMedicationSuccess,
  requestMedicationError,
  cancelMedicationStart,
  cancelMedicationSuccess,
} = medicationSlice.actions

export const fetchMedication = (medicationId: string): AppThunk => async (dispatch) => {
  dispatch(fetchMedicationStart())
  const fetchedMedication = await MedicationRepository.find(medicationId)
  const fetchedPatient = await PatientRepository.find(fetchedMedication.patient)
  dispatch(fetchMedicationSuccess({ medication: fetchedMedication, patient: fetchedPatient }))
}

const validateMedicationRequest = (newMedication: Medication): Error => {
  const medicationRequestError: Error = {}
  if (!newMedication.patient) {
    medicationRequestError.patient = 'medications.requests.error.patientRequired'
  }

  if (!newMedication.quantity) {
    medicationRequestError.quantity = 'medications.requests.error.quantityRequired'
  }

  return medicationRequestError
}

export const requestMedication = (
  newMedication: Medication,
  onSuccess?: (medication: Medication) => void,
): AppThunk => async (dispatch, getState) => {
  dispatch(requestMedicationStart())

  const medicationRequestError = validateMedicationRequest(newMedication)
  if (Object.keys(medicationRequestError).length > 0) {
    medicationRequestError.message = 'medications.requests.error.unableToRequest'
    dispatch(requestMedicationError(medicationRequestError))
  } else {
    newMedication.status = 'draft'
    newMedication.requestedOn = new Date(Date.now().valueOf()).toISOString()
    newMedication.requestedBy = getState().user?.user?.id || ''
    const requestedMedication = await MedicationRepository.save(newMedication)
    dispatch(requestMedicationSuccess(requestedMedication))

    if (onSuccess) {
      onSuccess(requestedMedication)
    }
  }
}

export const cancelMedication = (
  medicationToCancel: Medication,
  onSuccess?: (medication: Medication) => void,
): AppThunk => async (dispatch) => {
  dispatch(cancelMedicationStart())

  medicationToCancel.canceledOn = new Date(Date.now().valueOf()).toISOString()
  medicationToCancel.status = 'canceled'
  const canceledMedication = await MedicationRepository.saveOrUpdate(medicationToCancel)
  dispatch(cancelMedicationSuccess(canceledMedication))

  if (onSuccess) {
    onSuccess(canceledMedication)
  }
}

export const updateMedication = (
  medicationToUpdate: Medication,
  onSuccess?: (medication: Medication) => void,
): AppThunk => async (dispatch) => {
  dispatch(updateMedicationStart())
  const updatedMedication = await MedicationRepository.saveOrUpdate(medicationToUpdate)
  dispatch(updateMedicationSuccess(updatedMedication))

  if (onSuccess) {
    onSuccess(updatedMedication)
  }
}

export default medicationSlice.reducer
