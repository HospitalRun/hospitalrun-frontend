import AbstractDBModel from './AbstractDBModel'

export default interface Appointment extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patient: string
  location: string
  reason: string
  type: string
}
