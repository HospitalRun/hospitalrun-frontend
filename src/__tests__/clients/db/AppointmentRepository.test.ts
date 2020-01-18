import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { appointments } from 'config/pouchdb'

describe('Appointment Repository', () => {
  it('should create a repository with the database set to the appointments database', () => {
    expect(AppointmentRepository.db).toEqual(appointments)
  })
})
