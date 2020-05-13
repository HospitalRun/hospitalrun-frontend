import Appointment from 'model/Appointment'

const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

function toLocaleString(date: Date) {
  return date.toLocaleString([], options)
}

export function getAppointmentLabel(appointment: Appointment) {
  const { id, startDateTime, endDateTime } = appointment

  return startDateTime && endDateTime
    ? `${toLocaleString(new Date(startDateTime))} - ${toLocaleString(new Date(endDateTime))}`
    : id
}
