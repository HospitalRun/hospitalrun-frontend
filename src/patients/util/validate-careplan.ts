import isBefore from 'date-fns/isBefore'

import CarePlan from '../../shared/model/CarePlan'

export class CarePlanError extends Error {
  message: string

  title?: string

  description?: string

  status?: string

  intent?: string

  startDate?: string

  endDate?: string

  note?: string

  condition?: string

  constructor(
    message: string,
    title: string,
    description: string,
    status: string,
    intent: string,
    startDate: string,
    endDate: string,
    note: string,
    condition: string,
  ) {
    super(message)
    this.message = message
    this.title = title
    this.description = description
    this.status = status
    this.intent = intent
    this.startDate = startDate
    this.endDate = endDate
    this.note = note
    this.condition = condition
  }
}

export default function validateCarePlan(carePlan: Partial<CarePlan>): CarePlanError {
  const error = {} as CarePlanError

  if (!carePlan.title) {
    error.title = 'patient.carePlan.error.titleRequired'
  }

  if (!carePlan.description) {
    error.description = 'patient.carePlan.error.descriptionRequired'
  }

  if (!carePlan.status) {
    error.status = 'patient.carePlan.error.statusRequired'
  }

  if (!carePlan.intent) {
    error.intent = 'patient.carePlan.error.intentRequired'
  }

  if (!carePlan.startDate) {
    error.startDate = 'patient.carePlan.error.startDateRequired'
  }

  if (!carePlan.endDate) {
    error.endDate = 'patient.carePlan.error.endDateRequired'
  }

  if (carePlan.startDate && carePlan.endDate) {
    if (isBefore(new Date(carePlan.endDate), new Date(carePlan.startDate))) {
      error.endDate = 'patient.carePlan.error.endDateMustBeAfterStartDate'
    }
  }

  if (!carePlan.diagnosisId) {
    error.condition = 'patient.carePlan.error.conditionRequired'
  }

  return error
}
