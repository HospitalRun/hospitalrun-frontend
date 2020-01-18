import Appointment from 'model/Appointment'
import { appointments } from 'config/pouchdb'
import Repository from './Repository'

export class AppointmentRepository extends Repository<Appointment> {
  constructor() {
    super(appointments)
  }
}

export default new AppointmentRepository()
