import Imaging from '../../shared/model/Imaging'

const statusType: string[] = ['requested', 'completed', 'canceled']

export class ImagingRequestError extends Error {
  patient?: string

  type?: string

  status?: string

  constructor(message: string, patient?: string, type?: string, status?: string) {
    super(message)
    this.patient = patient
    this.type = type
    this.status = status
    Object.setPrototypeOf(this, ImagingRequestError.prototype)
  }
}

export default function validateImagingRequest(request: Partial<Imaging>) {
  const imagingRequestError = {} as any
  if (!request.patient) {
    imagingRequestError.patient = 'imagings.requests.error.patientRequired'
  }

  if (!request.type) {
    imagingRequestError.type = 'imagings.requests.error.typeRequired'
  }

  if (!request.status) {
    imagingRequestError.status = 'imagings.requests.error.statusRequired'
  } else if (!statusType.includes(request.status)) {
    imagingRequestError.status = 'imagings.requests.error.incorrectStatus'
  }

  return imagingRequestError
}
