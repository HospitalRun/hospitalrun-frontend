/* eslint "@typescript-eslint/camelcase": "off" */
import { v4 as uuidv4 } from 'uuid'

import SortRequest, { Unsorted } from 'clients/db/SortRequest'
import AbstractDBModel from 'model/AbstractDBModel'

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
    const selector: any = {
      _id: { $gt: null },
    }

    sort.sorts.forEach((s) => {
      selector[s.field] = { $gt: null }
    })

    // Adds an index to each of the fields coming from the sorting object
    // allowing the algorithm to sort by any given SortRequest, by avoiding the default index error (lack of index)

    await Promise.all(
      sort.sorts.map(
        async (s): Promise<SortRequest> => {
          await this.db.createIndex({
            index: {
              fields: [s.field],
            },
          })

          return sort
        },
      ),
    )

    const result = await this.db.find({
      selector,
      sort: sort.sorts.length > 0 ? sort.sorts.map((s) => ({ [s.field]: s.direction })) : undefined,
    })

    return result.docs.map(mapDocument)
  }

  async search(criteria: any): Promise<T[]> {
    const response = await this.db.find(criteria)
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
