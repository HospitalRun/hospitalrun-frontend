import Appointment from '../../../shared/model/Appointment'
import Lab from '../../../shared/model/Lab'
import { PatientHistoryRecord } from '../../../shared/model/PatientHistoryRecord'
import { convertLab, convertAppointment } from './helpers'

const mapLabs = (labs: Lab[] | undefined): PatientHistoryRecord[] => {
  if (!labs) {
    return []
  }
  let flattenedRecords = [] as PatientHistoryRecord[]
  labs.forEach((lab) => {
    flattenedRecords = flattenedRecords.concat(convertLab(lab))
  })
  return flattenedRecords
}

const mapAppointments = (appointments: Appointment[] | undefined): PatientHistoryRecord[] => {
  if (!appointments) {
    return []
  }
  let flattenedRecords = [] as PatientHistoryRecord[]
  appointments.forEach((appt) => {
    flattenedRecords = flattenedRecords.concat(convertAppointment(appt))
  })
  return flattenedRecords
}

export const mapHistoryRecords = (
  labs: Lab[] | undefined,
  appointments: Appointment[] | undefined,
): PatientHistoryRecord[] => {
  const labRecords = mapLabs(labs)
  const appointmentRecords = mapAppointments(appointments)

  const result = labRecords.concat(appointmentRecords)
  result.sort(
    (a: PatientHistoryRecord, b: PatientHistoryRecord): number =>
      b.date.getTime() - a.date.getTime(),
  )

  return result
}
