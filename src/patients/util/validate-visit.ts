import isBefore from 'date-fns/isBefore'

import Visit from '../../shared/model/Visit'

interface AddVisitError {
  message?: string
  status?: string
  intent?: string
  startDateTime?: string
  endDateTime?: string
}

export class VisitError extends Error {
  nameError?: string

  constructor(message: string, name: string) {
    super(message)
    this.nameError = name
    Object.setPrototypeOf(this, VisitError.prototype)
  }
}

export default function validateVisit(visit: Partial<Visit>) {
  const error: AddVisitError = {}

  if (!visit.startDateTime) {
    error.startDateTime = 'patient.visits.error.startDateRequired'
  }

  if (!visit.endDateTime) {
    error.endDateTime = 'patient.visits.error.endDateRequired'
  }

  if (!visit.type) {
    error.status = 'patient.visits.error.typeRequired'
  }

  if (visit.startDateTime && visit.endDateTime) {
    if (isBefore(new Date(visit.endDateTime), new Date(visit.startDateTime))) {
      error.endDateTime = 'patient.visits.error.endDateMustBeAfterStartDate'
    }
  }

  if (!visit.status) {
    error.status = 'patient.visits.error.statusRequired'
  }

  if (!visit.reason) {
    error.status = 'patient.visits.error.reasonRequired'
  }

  if (!visit.location) {
    error.status = 'patient.visits.error.locationRequired'
  }

  return error
}
