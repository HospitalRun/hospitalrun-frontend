import Appointment from '../../../model/Appointment'

export function getAppointmentLabel(appointment: Appointment) {
  const { id, startDateTime, endDateTime } = appointment

  return startDateTime && endDateTime
    ? `${new Date(startDateTime).toLocaleString()} - ${new Date(endDateTime).toLocaleString()}`
    : id
}
