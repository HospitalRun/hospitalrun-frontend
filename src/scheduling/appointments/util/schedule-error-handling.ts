import Appointment from 'model/Appointment'
import { isBefore } from 'date-fns'

interface ErrorMessage {
  [key: string]: string
}

export default (appointment: Appointment) => {
  const errors: ErrorMessage = {}

  if (!appointment.patientId) {
    errors.patient = 'scheduling.appointment.errors.patientRequired'
  }

  if (!appointment.endDateTime) {
    errors.endDateTime = 'scheduling.appointment.errors.endDateTimeRequired'
  }

  if (!appointment.startDateTime) {
    errors.startDateTime = 'scheduling.appointment.errors.startDateTimeRequired'
  }

  if (isBefore(new Date(appointment.endDateTime), new Date(appointment.startDateTime))) {
    errors.endDateTime = 'scheduling.appointment.errors.startDateMustBeBeforeEndDate'
  }

  return errors
}
