import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { appointments } from 'config/pouchdb'
import Appointment from 'model/Appointment'
import { fromUnixTime } from 'date-fns'

describe('Appointment Repository', () => {
  it('should create a repository with the database set to the appointments database', () => {
    expect(AppointmentRepository.db).toEqual(appointments)
  })

  describe('find', () => {
    it('should find an appointment by id', async () => {
      await appointments.put({ _id: 'id5678' }) // store another patient just to make sure we pull back the right one
      const expectedAppointment = await appointments.put({ _id: 'id1234' })

      const actualAppointment = await AppointmentRepository.find('id1234')

      expect(actualAppointment).toBeDefined()
      expect(actualAppointment.id).toEqual(expectedAppointment.id)

      await appointments.remove(await appointments.get('id1234'))
      await appointments.remove(await appointments.get('id5678'))
    })
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
