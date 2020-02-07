import { patients } from 'config/pouchdb'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import { fromUnixTime } from 'date-fns'
import { updatePatientStart } from 'patients/patient-slice'

describe('patient repository', () => {
  describe('find', () => {
    it('should return a patient with the correct data', async () => {
      await patients.put({ _id: 'id5678' }) // store another patient just to make sure we pull back the right one
      const expectedPatient = await patients.put({ _id: 'id1234' })

      const actualPatient = await PatientRepository.find('id1234')

      expect(actualPatient).toBeDefined()
      expect(actualPatient.id).toEqual(expectedPatient.id)

      await patients.remove(await patients.get('id1234'))
      await patients.remove(await patients.get('id5678'))
    })
  })

  describe('search', () => {
    it('should return all records that friendly ids match search text', async () => {
      // same full name to prove that it is finding by friendly id
      const expectedFriendlyId = 'P00001'
      await patients.put({ _id: 'id5678', friendlyId: expectedFriendlyId, fullName: 'test test' })
      await patients.put({ _id: 'id1234', friendlyId: 'P00002', fullName: 'test test' })

      const result = await PatientRepository.search(expectedFriendlyId)

      expect(result).toHaveLength(1)
      expect(result[0].friendlyId).toEqual(expectedFriendlyId)

      await patients.remove(await patients.get('id1234'))
      await patients.remove(await patients.get('id5678'))
    })

    it('should return all records that fullName contains search text', async () => {
      await patients.put({ _id: 'id1234', friendlyId: 'P00002', fullName: 'blh test test blah' })
      await patients.put({ _id: 'id5678', friendlyId: 'P00001', fullName: 'test test' })
      await patients.put({ _id: 'id2345', friendlyId: 'P00003', fullName: 'not found' })

      const result = await PatientRepository.search('test test')

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('id1234')
      expect(result[1].id).toEqual('id5678')

      await patients.remove(await patients.get('id1234'))
      await patients.remove(await patients.get('id5678'))
      await patients.remove(await patients.get('id2345'))
    })

    it('should match search criteria with case insensitive match', async () => {
      await patients.put({ _id: 'id5678', friendlyId: 'P00001', fullName: 'test test' })
      await patients.put({ _id: 'id1234', friendlyId: 'P00002', fullName: 'not found' })

      const result = await PatientRepository.search('TEST TEST')

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id5678')

      await patients.remove(await patients.get('id1234'))
      await patients.remove(await patients.get('id5678'))
    })
  })

  describe('findAll', () => {
    it('should find all patients in the database sorted by their ids', async () => {
      const expectedPatient2 = await patients.put({ _id: 'id5678' })
      const expectedPatient1 = await patients.put({ _id: 'id1234' })

      const result = await PatientRepository.findAll()

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual(expectedPatient1.id)
      expect(result[1].id).toEqual(expectedPatient2.id)

      await patients.remove(await patients.get('id1234'))
      await patients.remove(await patients.get('id5678'))
    })
  })

  describe('save', () => {
    it('should generate an id that is a timestamp for the patient', async () => {
      const newPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      expect(fromUnixTime(parseInt(newPatient.id, 10)).getTime() > 0).toBeTruthy()

      await patients.remove(await patients.get(newPatient.id))
    })

    it('should generate a friendly id', async () => {
      const newPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      expect(newPatient.friendlyId).toEqual('P00001')

      await patients.remove(await patients.get(newPatient.id))
    })

    it('should sequentially generate a friendly id', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      const newPatient = await PatientRepository.save({
        fullName: 'test1 test1',
      } as Patient)

      expect(newPatient.friendlyId).toEqual('P00002')

      await patients.remove(await patients.get(existingPatient.id))
      await patients.remove(await patients.get(newPatient.id))
    })
  })

  describe('saveOrUpdate', () => {
    it('should save the patient if an id was not on the entity', async () => {
      const newPatient = await PatientRepository.saveOrUpdate({
        fullName: 'test1 test1',
      } as Patient)

      expect(newPatient.id).toBeDefined()

      await patients.remove(await patients.get(newPatient.id))
    })

    it('should update the patient if one was already existing', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.id).toEqual(existingPatient.id)

      await patients.remove(await patients.get(existingPatient.id))
    })

    it('should update the existing fields', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)
      existingPatient.fullName = 'changed'

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.fullName).toEqual('changed')

      await patients.remove(await patients.get(existingPatient.id))
    })

    it('should add new fields without changing existing fields', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)
      existingPatient.givenName = 'givenName'

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.fullName).toEqual(existingPatient.fullName)
      expect(updatedPatient.givenName).toEqual('givenName')

      await patients.remove(await patients.get(existingPatient.id))
    })
  })

  describe('delete', () => {
    it('should delete the patient', async () => {
      const patientToDelete = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      await PatientRepository.delete(patientToDelete)

      const allDocs = await patients.allDocs()
      expect(allDocs.total_rows).toEqual(0)
    })
  })
})
