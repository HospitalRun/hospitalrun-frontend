/* eslint "@typescript-eslint/camelcase": "off" */
import { v4 as uuidv4 } from 'uuid'
import AbstractDBModel from '../../model/AbstractDBModel'
import SortRequest, { Unsorted } from './SortRequest'

function mapDocument(document: any): any {
  const { _id, _rev, ...values } = document
  return {
    id: _id,
    rev: _rev,
    ...values,
  }
}

export default class Repository<T extends AbstractDBModel> {
  db: PouchDB.Database

  constructor(db: PouchDB.Database) {
    this.db = db
  }

  async find(id: string): Promise<T> {
    const document = await this.db.get(id)
    return mapDocument(document)
  }

  async findAll(sort = Unsorted): Promise<T[]> {
    const selector = {
      _id: { $gt: null },
    }

    return this.search({ selector }, sort)
  }

  async search(criteria: any, sort: SortRequest = Unsorted): Promise<T[]> {
    // hack to get around the requirement that any sorted field must be in the selector list
    sort.sorts.forEach((s) => {
      criteria.selector[s.field] = { $gt: null }
    })
    const allCriteria = {
      ...criteria,
      sort: sort.sorts.map((s) => ({ [s.field]: s.direction })),
    }
    const response = await this.db.find(allCriteria)
    return response.docs.map(mapDocument)
  }

  async save(entity: T): Promise<T> {
    const currentTime = new Date().toISOString()

    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.put({
      _id: uuidv4(),
      ...valuesToSave,
      createdAt: currentTime,
      updatedAt: currentTime,
    })
    return this.find(savedEntity.id)
  }

  async saveOrUpdate(entity: T): Promise<T> {
    if (!entity.id) {
      return this.save(entity)
    }

    const { id, rev, ...dataToSave } = entity

    try {
      await this.find(entity.id)
      const entityToUpdate = {
        _id: id,
        _rev: rev,
        ...dataToSave,
        updatedAt: new Date().toISOString(),
      }

      await this.db.put(entityToUpdate)
      return this.find(entity.id)
    } catch (error) {
      return this.save(entity)
    }
  }

  async delete(entity: T): Promise<T> {
    const e = entity as any
    return mapDocument(this.db.remove(e.id, e.rev))
  }
}
