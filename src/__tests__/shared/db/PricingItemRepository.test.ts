import { getTime, isAfter } from 'date-fns'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'

import { relationalDb } from '../../../shared/config/pouchdb'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'

const uuidValidateV4 = (uuid: string) => uuidValidate(uuid) && uuidVersion(uuid) === 4

const removeAllDocs = async () => {
  const docs = await relationalDb.rel.find('pricingItem')
  docs.pricingItems.forEach(async (d: any) => {
    await relationalDb.rel.del('pricingItem', d)
  })
}

describe('Pricing Item Repository', () => {
  describe('save', () => {
    const expectedPricingItem = {
      name: 'pricing item',
    } as PricingItem

    afterEach(async () => {
      await removeAllDocs()
    })

    it('should save pricing item', async () => {
      const newPricingItem = await PricingItemRepository.save(expectedPricingItem)

      expect(newPricingItem).toMatchObject(expectedPricingItem)
    })

    it('should generate an id that is a valid uuid', async () => {
      const newPricingItem = await PricingItemRepository.save(expectedPricingItem)

      expect(uuidValidateV4(newPricingItem.id)).toBeTruthy()
    })
  })

  describe('saveOrUpdate', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should save the pricing item if an id was not on the entity', async () => {
      const newPricingItem = await PricingItemRepository.saveOrUpdate({
        name: 'name',
      } as PricingItem)

      expect(newPricingItem.id).toBeDefined()
    })

    it('should update the pricing item if one was already existing', async () => {
      const existingPricingItem = await PricingItemRepository.save({
        name: 'test',
      } as PricingItem)

      const updatedPricingItem = await PricingItemRepository.saveOrUpdate(existingPricingItem)

      expect(updatedPricingItem.id).toEqual(existingPricingItem.id)
    })

    it('should update the existing fields', async () => {
      const existingPricingItem = await PricingItemRepository.save({
        name: 'name',
      } as PricingItem)
      existingPricingItem.name = 'name changed'

      const updatedPricingItem = await PricingItemRepository.saveOrUpdate(existingPricingItem)

      expect(updatedPricingItem.name).toEqual('name changed')
    })

    it('should add new fields without changing existing fields', async () => {
      const existingPricingItem = await PricingItemRepository.save({
        name: 'name',
      } as PricingItem)
      existingPricingItem.type = 'type'

      const updatedPricingItem = await PricingItemRepository.saveOrUpdate(existingPricingItem)

      expect(updatedPricingItem.name).toEqual(existingPricingItem.name)
      expect(updatedPricingItem.type).toEqual('type')
    })

    it('should update the last updated date', async () => {
      const time = new Date(2020, 1, 1).toISOString()
      await relationalDb.rel.save('pricingItem', { id: 'id2', createdAt: time, updatedAt: time })
      const existingPricingItem = await PricingItemRepository.find('id2')

      const updatedPricingItem = await PricingItemRepository.saveOrUpdate(existingPricingItem)

      expect(
        isAfter(new Date(updatedPricingItem.updatedAt), new Date(updatedPricingItem.createdAt)),
      ).toBeTruthy()
      expect(updatedPricingItem.updatedAt).not.toEqual(existingPricingItem.updatedAt)
    })

    it('should not update the created date', async () => {
      const time = getTime(new Date(2020, 1, 1))
      await relationalDb.rel.save('pricingItem', { id: 'id1', createdAt: time, updatedAt: time })
      const existingPricingItem = await PricingItemRepository.find('id1')
      const updatePricingItem = await PricingItemRepository.saveOrUpdate(existingPricingItem)

      expect(updatePricingItem.createdAt).toEqual(existingPricingItem.createdAt)
    })
  })

  describe('search', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return all records that name matches search text', async () => {
      const expectedPricingItem = {
        name: 'pricing item',
      } as PricingItem

      await relationalDb.rel.save('pricingItem', expectedPricingItem)

      await relationalDb.rel.save('pricingItem', {
        name: 'test',
      } as PricingItem)

      const result = await PricingItemRepository.search({
        text: 'pricing item',
      } as any)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject(expectedPricingItem)
    })

    it('should return all records that name contains search text', async () => {
      await relationalDb.rel.save('pricingItem', {
        name: '123 test 456',
      } as PricingItem)

      const result = await PricingItemRepository.search({
        name: 'test',
      } as any)

      expect(result).toHaveLength(1)
      expect(result[0].name).toEqual('123 test 456')
    })

    it('should match search criteria with case insensitive match', async () => {
      const expectedPricingItem = {
        name: 'pricing item',
      } as PricingItem

      await relationalDb.rel.save('pricingItem', expectedPricingItem)

      const result = await PricingItemRepository.search({
        name: 'PRICING ITEM',
      } as any)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject(expectedPricingItem)
    })

    it('should be able to search by category', async () => {
      const expectedPricingItem = {
        name: 'expected name',
        category: 'imaging',
      } as PricingItem

      await relationalDb.rel.save('pricingItem', expectedPricingItem)

      await relationalDb.rel.save('pricingItem', {
        name: 'test 2',
        category: 'lab',
      } as PricingItem)

      const result = await PricingItemRepository.search({
        category: 'imaging',
      } as any)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject(expectedPricingItem)
    })
  })

  describe('find', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should return the correct pricing item', async () => {
      await relationalDb.rel.save('pricingItem', {
        id: 'id test 2',
        name: 'name 2',
      } as PricingItem)

      const expectedPricingItemName = 'expected name'
      const expectedPricingItem = await relationalDb.rel.save('pricingItem', {
        id: 'id test 1',
        name: expectedPricingItemName,
      } as PricingItem)

      const actualPricingItem = await PricingItemRepository.find('id test 1')

      expect(expectedPricingItem.id).toEqual(actualPricingItem.id)
      expect(actualPricingItem.name).toEqual(expectedPricingItemName)
    })
  })

  describe('findAll', () => {
    afterEach(async () => {
      await removeAllDocs()
    })

    it('should find all pricing itens in the database sorted by their ids', async () => {
      const expectedPricingItem2 = await relationalDb.rel.save('pricingItem', { id: '2' })
      const expectedPricingItem1 = await relationalDb.rel.save('pricingItem', { id: '1' })

      const result = await PricingItemRepository.findAll()

      expect(result.length).toEqual(2)
      expect(result[0].id).toEqual(expectedPricingItem1.id)
      expect(result[1].id).toEqual(expectedPricingItem2.id)
    })
  })

  describe('delete', () => {
    it('should delete the pricing item', async () => {
      await relationalDb.rel.save('pricingItem', {
        id: '1 teste',
        name: 'name',
      } as PricingItem)

      const pricingItemToDelete = await PricingItemRepository.find('1 teste')

      await PricingItemRepository.delete(pricingItemToDelete)

      const pricingItens = await PricingItemRepository.findAll()
      expect(pricingItens).toHaveLength(0)
    })
  })
})
