import AbstractDBModel from './AbstractDBModel'

export default interface Appointment extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patientId: string
  location: string
  reason: string
  type: string
}
