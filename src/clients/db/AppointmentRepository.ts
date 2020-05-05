import escapeStringRegexp from 'escape-string-regexp'
import Appointment from 'model/Appointment'
import { appointments } from 'config/pouchdb'
import Repository from './Repository'

export class AppointmentRepository extends Repository<Appointment> {
  constructor() {
    super(appointments)
  }

  // Fuzzy search for patient appointments. Used for patient appointment search bar
  async searchPatientAppointments(patientId: string, text: string): Promise<Appointment[]> {
    const escapedString = escapeStringRegexp(text)
    return super.search({
      selector: {
        $and: [
          {
            patientId,
          },
          {
            $or: [
              {
                location: {
                  $regex: RegExp(escapedString, 'i'),
                },
              },
              {
                reason: {
                  $regex: RegExp(escapedString, 'i'),
                },
              },
              {
                type: {
                  $regex: RegExp(escapedString, 'i'),
                },
              },
            ],
          },
        ],
      },
    })
  }
}

export default new AppointmentRepository()
