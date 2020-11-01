import Appointment from '../../../shared/model/Appointment'
import Lab from '../../../shared/model/Lab'
import { HistoryRecordType, PatientHistoryRecord } from '../../../shared/model/PatientHistoryRecord'

export const mapHistoryRecords = (labs: Lab[] | undefined, appointments: Appointment[] | undefined): PatientHistoryRecord[] => {

  const labRecords = mapLabs(labs)
  const appointmentRecords = mapAppointments(appointments)

  const result = labRecords.concat(appointmentRecords)

  result.sort(
    (a: PatientHistoryRecord, b: PatientHistoryRecord): number =>
      b.date.getTime() - a.date.getTime(),
  )

  return result
}

const mapLabs = (labs: Lab[] | undefined): PatientHistoryRecord[] => {
  if (!labs) return []
  return labs.map((lab) => ({
    date: new Date(lab.requestedOn),
    type: HistoryRecordType.LAB,
    info: lab.type,
    recordId: lab.id,
  }))
}

const mapAppointments = (appointments: Appointment[] | undefined): PatientHistoryRecord[] => {
  if (!appointments) return []

  return appointments.map((appointment) => ({
    date: new Date(appointment.startDateTime),
    type: HistoryRecordType.APPOINTMENT,
    info: appointment.type,
    recordId: appointment.id,
  }))
}