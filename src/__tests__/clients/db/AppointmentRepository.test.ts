import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { appointments } from 'config/pouchdb'
import Appointment from 'model/Appointment'
import { fromUnixTime } from 'date-fns'

describe('Appointment Repository', () => {
  it('should create a repository with the database set to the appointments database', () => {
    expect(AppointmentRepository.db).toEqual(appointments)
  })

  describe('save', () => {
    it('should create an id that is a timestamp', async () => {
      const newAppointment = await AppointmentRepository.save({
        patientId: 'id',
      } as Appointment)

      expect(fromUnixTime(parseInt(newAppointment.id, 10)).getTime() > 0).toBeTruthy()

      await appointments.remove(await appointments.get(newAppointment.id))
    })
  })
})
