import isEmpty from 'lodash/isEmpty'

import Lab from '../../shared/model/Lab'

export class LabError extends Error {
  message: string

  result?: string

  patient?: string

  type?: string

  constructor(message: string, result: string, patient: string, type: string) {
    super(message)
    this.message = message
    this.result = result
    this.patient = patient
    this.type = type
  }
}

export function validateLabRequest(lab: Partial<Lab>): LabError {
  const labError = {} as LabError

  if (!lab.patient) {
    labError.patient = 'labs.requests.error.patientRequired'
  }

  if (!lab.type) {
    labError.type = 'labs.requests.error.typeRequired'
  }

  if (!isEmpty(labError)) {
    labError.message = 'labs.requests.error.unableToRequest'
  }
  return labError
}

export function validateLabComplete(lab: Partial<Lab>): LabError {
  const labError = {} as LabError

  if (!lab.result) {
    labError.result = 'labs.requests.error.resultRequiredToComplete'
    labError.message = 'labs.requests.error.unableToComplete'
  }

  return labError
}
