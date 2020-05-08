/* eslint "@typescript-eslint/camelcase": "off" */
import shortid from 'shortid'
import { labs } from 'config/pouchdb'
import LabRepository from 'clients/db/LabRepository'
import SortRequest from 'clients/db/SortRequest'
import Lab from '../../../model/Lab'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}

const removeAllDocs = async () => {
  const allDocs = await labs.allDocs({ include_docs: true })
  await Promise.all(
    allDocs.rows.map(async (row) => {
      if (row.doc) {
        await labs.remove(row.doc)
      }
    }),
  )
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

describe('lab repository', () => {
  describe('find', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return a lab with the correct data', async () => {
      // first lab to store is to have mock data to make sure we are getting the expected
      await labs.put({ _id: 'id1111' })
      const expectedLab = await labs.put({ _id: 'id2222' })

      const actualLab = await LabRepository.find('id2222')

      expect(actualLab).toBeDefined()
      expect(actualLab.id).toEqual(expectedLab.id)
    })

    it('should generate a lab code', async () => {
      const newLab = await LabRepository.save({
        patientId: '123',
        type: 'test',
      } as Lab)

      expect(shortid.isValid(newLab.code)).toBeTruthy()
    })
  })

  describe('search', () => {
    it('should return all records that lab type matches search text', async () => {
      const expectedLabType = 'more tests'
      await labs.put({ _id: 'someId1', type: expectedLabType, status: 'requested' })
      await labs.put({ _id: 'someId2', type: 'P00002', status: 'requested' })

      searchObject.text = expectedLabType

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].type).toEqual(expectedLabType)
    })

    it('should return all records that contains search text in the type', async () => {
      const expectedLabType = 'Labs Tests'
      await labs.put({ _id: 'someId3', type: expectedLabType })
      await labs.put({ _id: 'someId4', type: 'Sencond Lab labs tests' })
      await labs.put({ _id: 'someId5', type: 'not found' })

      searchObject.text = expectedLabType

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('someId3')
      expect(result[1].id).toEqual('someId4')
    })

    it('should return all records that contains search text in code', async () => {
      const expectedLabCode = 'L-CODE-sam445Pl'
      await labs.put({ _id: 'theID13', type: 'Expected', code: 'L-CODE-sam445Pl' })
      await labs.put({ _id: 'theID14', type: 'Sencond Lab labs tests', code: 'L-4XXX' })
      await labs.put({ _id: 'theID15', type: 'not found', code: 'L-775YYxc' })

      searchObject.text = expectedLabCode

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('theID13')
    })

    it('should match search criteria with case insesitive match', async () => {
      await labs.put({ _id: 'id3333', type: 'lab tests' })
      await labs.put({ _id: 'id4444', type: 'not found' })

      searchObject.text = 'LAB TESTS'

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('id3333')
    })

    it('should return all records that matches an specific status', async () => {
      await labs.put({ _id: 'id5555', type: 'lab tests', status: 'requested' })
      await labs.put({ _id: 'id6666', type: 'lab tests', status: 'requested' })
      await labs.put({ _id: 'id7777', type: 'lab tests', status: 'completed' })
      await labs.put({ _id: 'id8888', type: 'not found', status: 'completed' })

      searchObject.text = ''
      searchObject.status = 'completed'

      const result = await LabRepository.search(searchObject)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual('id7777')
      expect(result[1].id).toEqual('id8888')
    })

    it('should return records with search text and specific status', async () => {
      await labs.put({ _id: 'theID09', type: 'the specific lab', status: 'requested' })
      await labs.put({ _id: 'theID10', type: 'not found', status: 'cancelled' })

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
      const expectedLab1 = await labs.put({ _id: 'theID11' })

      setTimeout(async () => {
        const expectedLab2 = await labs.put({ _id: 'theID12' })

        const result = await LabRepository.findAll()

        expect(result).toHaveLength(2)
        expect(result[0].id).toEqual(expectedLab1.id)
        expect(result[1].id).toEqual(expectedLab2.id)
      }, 1000)
    })
  })
})
