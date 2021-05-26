import { isEmpty } from 'lodash'

import Imaging from '../../shared/model/Imaging'

const statusType: string[] = ['requested', 'completed', 'canceled']

export class ImagingRequestError extends Error {
  patient?: string

  type?: string

  status?: string

  visit?: string

  constructor(message: string, patient?: string, type?: string, status?: string, visit?: string) {
    super(message)
    this.patient = patient
    this.type = type
    this.status = status
    this.visit = visit
    Object.setPrototypeOf(this, ImagingRequestError.prototype)
  }
}

export default function validateImagingRequest(request: Partial<Imaging>): ImagingRequestError {
  const imagingRequestError = {} as ImagingRequestError

  if (!request.patient) {
    imagingRequestError.patient = 'imagings.requests.error.patientRequired'
  }
  if (!request.visitId) {
    imagingRequestError.visit = 'imagings.requests.error.visitRequired'
  }
  if (!request.type) {
    imagingRequestError.type = 'imagings.requests.error.typeRequired'
  }

  if (!request.status) {
    imagingRequestError.status = 'imagings.requests.error.statusRequired'
  } else if (!statusType.includes(request.status)) {
    imagingRequestError.status = 'imagings.requests.error.incorrectStatus'
  }

  if (!isEmpty(imagingRequestError)) {
    imagingRequestError.message = 'imagings.requests.error.unableToRequest'
  }

  return imagingRequestError
}
