import { patients } from 'config/pouchdb'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import { fromUnixTime } from 'date-fns'

async function removeAllDocs() {
  // eslint-disable-next-line
  const allDocs = await patients.allDocs({ include_docs: true })
  await Promise.all(
    allDocs.rows.map(async (row) => {
      if (row.doc) {
        await patients.remove(row.doc)
      }
    }),
  )
}

describe('patient repository', () => {
  describe('find', () => {
    afterEach(async () => {
      await removeAllDocs()
    })
    it('should return a patient with the correct data', async () => {
      await patients.put({ _id: 'id1111' }) // store another patient just to make sure we pull back the right one
      const expectedPatient = await patients.put({ _id: 'id2222' })

      const actualPatient = await PatientRepository.find('id2222')

      expect(actualPatient).toBeDefined()
      expect(actualPatient.id).toEqual(expectedPatient.id)
    })
  })

  describe('search', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return all records that friendly ids match search text', async () => {
      // same full name to prove that it is finding by friendly id
      const expectedFriendlyId = 'P00001'
      await patients.put({ _id: 'someId1', friendlyId: expectedFriendlyId, fullName: 'test test' })
      await patients.put({ _id: 'someId2', friendlyId: 'P00002', fullName: 'test test' })

      const result = await PatientRepository.search(expectedFriendlyId)

      expect(result).toHaveLength(1)
      expect(result[0].friendlyId).toEqual(expectedFriendlyId)
    })

    it('should return all records that fullName contains search text', async () => {
      await patients.put({ _id: 'id3333', friendlyId: 'P00002', fullName: 'blh test test blah' })
      await patients.put({ _id: 'id4444', friendlyId: 'P00001', fullName: 'test test' })
      await patients.put({ _id: 'id5555', friendlyId: 'P00003', fullName: 'not found' })

      const result = await PatientRepository.search('test test')

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('id3333')
      expect(result[1].id).toEqual('id4444')
    })

    it('should match search criteria with case insensitive match', async () => {
      await patients.put({ _id: 'id6666', friendlyId: 'P00001', fullName: 'test test' })
      await patients.put({ _id: 'id7777', friendlyId: 'P00002', fullName: 'not found' })

      const result = await PatientRepository.search('TEST TEST')

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id6666')
    })
  })

  describe('findAll', () => {
    afterEach(async () => {
      await removeAllDocs()
    })
    it('should find all patients in the database sorted by their ids', async () => {
      const expectedPatient1 = await patients.put({ _id: 'id9999' })
      const expectedPatient2 = await patients.put({ _id: 'id8888' })

      const result = await PatientRepository.findAll()

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual(expectedPatient2.id)
      expect(result[1].id).toEqual(expectedPatient1.id)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should generate an id that is a timestamp for the patient', async () => {
      const newPatient = await PatientRepository.save({
        fullName: 'test test',
      } as Patient)

      expect(fromUnixTime(parseInt(newPatient.id, 10)).getTime() > 0).toBeTruthy()
    })

    it('should generate a friendly id', async () => {
      const newPatient = await PatientRepository.save({
        fullName: 'test1 test1',
      } as Patient)

      expect(newPatient.friendlyId).toEqual('P00001')
    })

    it('should sequentially generate a friendly id', async () => {
      await patients.put({ _id: 'id9999', friendlyId: 'P00001' })

      const newPatient = await PatientRepository.save({
        fullName: 'test3 test3',
      } as Patient)

      expect(newPatient.friendlyId).toEqual('P00002')
    })
  })

  describe('saveOrUpdate', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should save the patient if an id was not on the entity', async () => {
      const newPatient = await PatientRepository.saveOrUpdate({
        fullName: 'test4 test4',
      } as Patient)

      expect(newPatient.id).toBeDefined()
    })

    it('should update the patient if one was already existing', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test5 test5',
      } as Patient)

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.id).toEqual(existingPatient.id)
    })

    it('should update the existing fields', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test6 test6',
      } as Patient)
      existingPatient.fullName = 'changed'

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.fullName).toEqual('changed')
    })

    it('should add new fields without changing existing fields', async () => {
      const existingPatient = await PatientRepository.save({
        fullName: 'test7 test7',
      } as Patient)
      existingPatient.givenName = 'givenName'

      const updatedPatient = await PatientRepository.saveOrUpdate(existingPatient)

      expect(updatedPatient.fullName).toEqual(existingPatient.fullName)
      expect(updatedPatient.givenName).toEqual('givenName')
    })
  })

  describe('delete', () => {
    it('should delete the patient', async () => {
      const patientToDelete = await PatientRepository.save({
        fullName: 'test8 test8',
      } as Patient)

      await PatientRepository.delete(patientToDelete)

      const allDocs = await patients.allDocs()
      expect(allDocs.total_rows).toEqual(0)
    })
  })
})
