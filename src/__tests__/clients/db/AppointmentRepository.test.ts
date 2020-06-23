import AppointmentRepository from '../../../clients/db/AppointmentRepository'
import { relationalDb } from '../../../config/pouchdb'
import Appointment from '../../../model/Appointment'

const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i

describe('Appointment Repository', () => {
  it('should create a repository with the database set to the appointments database', () => {
    expect(AppointmentRepository.db).toEqual(relationalDb)
  })

  describe('find', () => {
    it('should create an id that is a uuid', async () => {
      const newAppointment = await AppointmentRepository.save({
        patient: 'id',
      } as Appointment)

      expect(uuidV4Regex.test(newAppointment.id)).toBeTruthy()
    })

    it('should find an appointment by id', async () => {
      await relationalDb.rel.save('appointment', { id: 'id5678' })
      const expectedAppointment = await relationalDb.rel.save('appointment', { id: 'id1234' })

      const actualAppointment = await AppointmentRepository.find('id1234')

      expect(actualAppointment).toBeDefined()
      expect(actualAppointment.id).toEqual(expectedAppointment.id)

      await relationalDb.rel.del(
        'appointment',
        await relationalDb.rel.find('appointment', 'id1234'),
      )
      await relationalDb.rel.del(
        'appointment',
        await relationalDb.rel.find('appointment', 'id5678'),
      )
    })
  })

  describe('searchPatientAppointments', () => {
    it('should escape all special chars from search text', async () => {
      await relationalDb.rel.save('patient', { id: 'id2222' })
      await relationalDb.rel.save('appointment', {
        id: 'id3333',
        patient: 'id2222',
        location: 'id-]?}(){*[$+.^\\',
      })

      const result = await AppointmentRepository.searchPatientAppointments(
        'id2222',
        'id-]?}(){*[$+.^\\',
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id3333')
    })
  })

  describe('save', () => {
    it('should generate a timestamp for created date and last updated date', async () => {
      const newAppointment = await AppointmentRepository.save({
        patient: 'id',
      } as Appointment)

      expect(newAppointment.createdAt).toBeDefined()
      expect(newAppointment.updatedAt).toBeDefined()
    })
  })
})
