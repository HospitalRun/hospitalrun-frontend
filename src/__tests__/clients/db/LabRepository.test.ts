import shortid from 'shortid'

import LabRepository from '../../../clients/db/LabRepository'
import SortRequest from '../../../clients/db/SortRequest'
import { relationalDb } from '../../../config/pouchdb'
import Lab from '../../../model/Lab'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const searchObject: SearchContainer = {
  text: '',
  status: 'all',
  defaultSortRequest,
}

async function removeAllDocs() {
  const docs = await relationalDb.rel.find('lab')
  docs.labs.forEach(async (d: any) => {
    await relationalDb.rel.del('lab', d)
  })
}

describe('lab repository', () => {
  describe('find', () => {
    afterEach(async () => {
      const docs = await relationalDb.rel.find('lab')
      docs.labs.forEach(async (d: any) => {
        await relationalDb.rel.del('lab', d)
      })
    })

    it('should return a lab with the correct data', async () => {
      // first lab to store is to have mock data to make sure we are getting the expected
      await relationalDb.rel.save('lab', { _id: 'id1111' })
      const expectedLab = await relationalDb.rel.save('lab', { id: 'id2222' })

      const actualLab = await LabRepository.find('id2222')

      expect(actualLab).toBeDefined()
      expect(actualLab.id).toEqual(expectedLab.id)
    })

    it('should generate a lab code', async () => {
      const newLab = await LabRepository.save({
        patient: '123',
        type: 'test',
      } as Lab)

      expect(shortid.isValid(newLab.code)).toBeTruthy()
    })
  })

  describe('search', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return all records that lab type matches search text', async () => {
      const expectedLabType = 'more tests'
      await relationalDb.rel.save('lab', {
        id: 'someId1',
        type: expectedLabType,
        status: 'requested',
      })
      await relationalDb.rel.save('lab', {
        id: 'someId2',
        type: 'P00002',
        status: 'requested',
      })

      searchObject.text = expectedLabType

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].type).toEqual(expectedLabType)
    })

    it('should return all records that contains search text in the type', async () => {
      const expectedLabType = 'Labs Tests'
      await relationalDb.rel.save('lab', {
        id: 'someId3',
        type: expectedLabType,
      })
      await relationalDb.rel.save('lab', {
        id: 'someId4',
        type: 'Sencond Lab labs tests',
      })
      await relationalDb.rel.save('lab', {
        id: 'someId5',
        type: 'not found',
      })

      searchObject.text = expectedLabType

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('someId3')
      expect(result[1].id).toEqual('someId4')
    })

    it('should return all records that contains search text in code', async () => {
      const expectedLabCode = 'L-CODE-sam445Pl'
      await relationalDb.rel.save('lab', {
        id: 'theID13',
        type: 'Expected',
        code: 'L-CODE-sam445Pl',
      })
      await relationalDb.rel.save('lab', {
        id: 'theID14',
        type: 'Second Lab labs tests',
        code: 'L-4XXX',
      })
      await relationalDb.rel.save('lab', {
        id: 'theID15',
        type: 'not found',
        code: 'L-775YYxc',
      })

      searchObject.text = expectedLabCode

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('theID13')
    })

    it('should match search criteria with case insesitive match', async () => {
      await relationalDb.rel.save('lab', {
        id: 'id3333',
        type: 'lab tests',
      })
      await relationalDb.rel.save('lab', {
        id: 'id4444',
        type: 'not found',
      })

      searchObject.text = 'LAB TESTS'

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id3333')
    })

    it('should return all records that matches an specific status', async () => {
      await relationalDb.rel.save('lab', {
        id: 'id5555',
        type: 'lab tests',
        status: 'requested',
      })
      await relationalDb.rel.save('lab', {
        id: 'id6666',
        type: 'lab tests',
        status: 'requested',
      })
      await relationalDb.rel.save('lab', {
        id: 'id7777',
        type: 'lab tests',
        status: 'completed',
      })
      await relationalDb.rel.save('lab', {
        id: 'id8888',
        type: 'not found',
        status: 'completed',
      })

      searchObject.text = ''
      searchObject.status = 'completed'

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('id7777')
      expect(result[1].id).toEqual('id8888')
    })

    it('should return records with search text and specific status', async () => {
      await relationalDb.rel.save('lab', {
        id: 'theID09',
        type: 'the specific lab',
        status: 'requested',
      })
      await relationalDb.rel.save('lab', { id: 'theID10', type: 'not found', status: 'cancelled' })

      searchObject.text = 'the specific lab'
      searchObject.status = 'requested'

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('theID09')
    })
  })

  describe('findAll', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should find all labs in the database sorted by their requestedOn', async () => {
      const expectedLab1 = await relationalDb.rel.save('lab', { id: 'theID11' })
      const expectedLab2 = await relationalDb.rel.save('lab', { id: 'theID12' })

      const result = await LabRepository.findAll()

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual(expectedLab1.id)
      expect(result[1].id).toEqual(expectedLab2.id)
    })
  })
})
