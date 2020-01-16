import AbstractDBModel from './AbstractDBModel'

export default interface Appointment extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patientId: string
  title: string
  location: string
  notes: string
}
