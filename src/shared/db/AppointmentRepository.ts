import escapeStringRegexp from 'escape-string-regexp'

import { relationalDb } from '../config/pouchdb'
import Appointment from '../model/Appointment'
import Repository from './Repository'

class AppointmentRepository extends Repository<Appointment> {
  constructor() {
    super('appointment', relationalDb)
    this.db.createIndex({
      index: {
        fields: ['data.patient', '_id'],
      },
    })
  }

  // Fuzzy search for patient appointments. Used for patient appointment search bar
  async searchPatientAppointments(patientId: string, text: string): Promise<Appointment[]> {
    const escapedString = escapeStringRegexp(text)
    return super.search({
      selector: {
        $and: [
          {
            'data.patient': patientId,
          },
          {
            $or: [
              {
                'data.location': {
                  $regex: RegExp(escapedString, 'i'),
                },
              },
              {
                'data.reason': {
                  $regex: RegExp(escapedString, 'i'),
                },
              },
              {
                'data.type': {
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
