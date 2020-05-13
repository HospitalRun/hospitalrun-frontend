import AbstractDBModel from 'model/AbstractDBModel'

export default interface Appointment extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patientId: string
  location: string
  reason: string
  type: string
}
