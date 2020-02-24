import Appointment from 'model/Appointment'
import { appointments } from 'config/pouchdb'
import Repository from './Repository'

export class AppointmentRepository extends Repository<Appointment> {
  constructor() {
    super(appointments)
  }

  // Fuzzy search for patient appointments. Used for patient appointment search bar
  async searchPatientAppointments(patientId: string, text: string): Promise<Appointment[]> {
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
                  $regex: RegExp(text, 'i'),
                },
              },
              {
                reason: {
                  $regex: RegExp(text, 'i'),
                },
              },
              {
                type: {
                  $regex: RegExp(text, 'i'),
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
