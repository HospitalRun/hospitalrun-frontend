import isBefore from 'date-fns/isBefore'

import CareGoal from '../../shared/model/CareGoal'

export class CareGoalError extends Error {
  message: string

  description?: string

  status?: string

  achievementStatus?: string

  priority?: string

  startDate?: string

  dueDate?: string

  constructor(
    message: string,
    description: string,
    status: string,
    achievementStatus: string,
    priority: string,
    startDate: string,
    dueDate: string,
  ) {
    super(message)
    this.message = message
    this.description = description
    this.status = status
    this.achievementStatus = achievementStatus
    this.priority = priority
    this.startDate = startDate
    this.dueDate = dueDate
  }
}

export default function validateCareGoal(careGoal: Partial<CareGoal>): CareGoalError {
  const error = {} as CareGoalError

  if (!careGoal.description) {
    error.description = 'patient.careGoal.error.descriptionRequired'
  }

  if (!careGoal.status) {
    error.status = 'patient.careGoal.error.statusRequired'
  }

  if (!careGoal.achievementStatus) {
    error.achievementStatus = 'patient.careGoal.error.achievementStatusRequired'
  }

  if (!careGoal.priority) {
    error.priority = 'patient.careGoal.error.priorityRequired'
  }

  if (!careGoal.startDate) {
    error.startDate = 'patient.careGoal.error.startDate'
  }

  if (!careGoal.dueDate) {
    error.dueDate = 'patient.careGoal.error.dueDate'
  }

  if (careGoal.startDate && careGoal.dueDate) {
    if (isBefore(new Date(careGoal.dueDate), new Date(careGoal.startDate))) {
      error.dueDate = 'patient.careGoal.error.dueDateMustBeAfterStartDate'
    }
  }

  return error
}
