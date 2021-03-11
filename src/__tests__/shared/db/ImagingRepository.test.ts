import shortid from 'shortid'

import { relationalDb } from '../../../shared/config/pouchdb'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import Imaging from '../../../shared/model/Imaging'

const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i

async function removeAllDocs() {
  const docs = await relationalDb.rel.find('imaging')
  docs.imagings.forEach(async (d: any) => {
    await relationalDb.rel.del('imaging', d)
  })
}

describe('imaging repository', () => {
  describe('find', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return a imaging with the correct data', async () => {
      await relationalDb.rel.save('imaging', { _id: 'id1111' })
      const expectedImaging = await relationalDb.rel.save('imaging', { id: 'id2222' })

      const actualImaging = await ImagingRepository.find('id2222')

      expect(actualImaging).toBeDefined()
      expect(actualImaging.id).toEqual(expectedImaging.id)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should generate an id that is a uuid for the imaging', async () => {
      const newImaging = await ImagingRepository.save({
        patient: '123',
        type: 'test',
        status: 'status' as string,
        notes: 'some notes',
      } as Imaging)

      expect(uuidV4Regex.test(newImaging.id)).toBeTruthy()
    })

    it('should generate a imaging code', async () => {
      const newImaging = await ImagingRepository.save({
        code: 'somecode',
        patient: '123',
        type: 'test',
        status: 'status' as string,
        notes: 'some notes',
      } as Imaging)

      expect(shortid.isValid(newImaging.code)).toBeTruthy()
    })

    it('should generate a timestamp for created date and last updated date', async () => {
      const newImaging = await ImagingRepository.save({
        patient: '123',
        type: 'test',
        status: 'status' as string,
        notes: 'some notes',
      } as Imaging)

      expect(newImaging.createdAt).toBeDefined()
      expect(newImaging.updatedAt).toBeDefined()
    })

    it('should override the created date and last updated date even if one was passed in', async () => {
      const unexpectedTime = new Date(2020, 2, 1).toISOString()
      const newImaging = await ImagingRepository.save({
        createdAt: unexpectedTime,
        updatedAt: unexpectedTime,
      } as Imaging)

      expect(newImaging.createdAt).not.toEqual(unexpectedTime)
      expect(newImaging.updatedAt).not.toEqual(unexpectedTime)
    })
  })
})
