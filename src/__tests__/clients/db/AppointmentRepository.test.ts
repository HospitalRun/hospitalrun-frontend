import AppointmentRepository from 'clients/db/AppointmentRepository'
import { appointments, patients } from 'config/pouchdb'
import Appointment from 'model/Appointment'

const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i

describe('Appointment Repository', () => {
  it('should create a repository with the database set to the appointments database', () => {
    expect(AppointmentRepository.db).toEqual(appointments)
  })

  describe('find', () => {
    it('should find an appointment by id', async () => {
      await appointments.put({ _id: 'id5678' })
      const expectedAppointment = await appointments.put({ _id: 'id1234' })

      const actualAppointment = await AppointmentRepository.find('id1234')

      expect(actualAppointment).toBeDefined()
      expect(actualAppointment.id).toEqual(expectedAppointment.id)

      await appointments.remove(await appointments.get('id1234'))
      await appointments.remove(await appointments.get('id5678'))
    })
  })

  describe('searchPatientAppointments', () => {
    it('should escape all special chars from search text', async () => {
      await patients.put({ _id: 'id2222' })
      await appointments.put({ _id: 'id3333', patientId: 'id2222', location: 'id-]?}(){*[$+.^\\' })

      const result = await AppointmentRepository.searchPatientAppointments(
        'id2222',
        'id-]?}(){*[$+.^\\',
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id3333')
    })
  })

  describe('save', () => {
    it('should create an id that is a uuid', async () => {
      const newAppointment = await AppointmentRepository.save({
        patientId: 'id',
      } as Appointment)

      expect(uuidV4Regex.test(newAppointment.id)).toBeTruthy()

      await appointments.remove(await appointments.get(newAppointment.id))
    })

    it('should generate a timestamp for created date and last updated date', async () => {
      const newAppointment = await AppointmentRepository.save({
        patientId: 'id',
      } as Appointment)

      expect(newAppointment.createdAt).toBeDefined()
      expect(newAppointment.updatedAt).toBeDefined()
    })
  })
})
