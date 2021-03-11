import { v4 as uuidv4 } from 'uuid'

import { schema } from '../config/pouchdb'
import AbstractDBModel from '../model/AbstractDBModel'
import SortRequest, { Unsorted } from './SortRequest'

export default class Repository<T extends AbstractDBModel> {
  db: PouchDB.RelDatabase

  type: string

  pluralType: string

  constructor(type: string, db: PouchDB.RelDatabase) {
    this.db = db
    this.type = type
    this.pluralType = schema.find((s) => s.singular === this.type)?.plural || ''
  }

  async find(id: string): Promise<T> {
    const documents = await this.db.rel.find(this.type, id)
    const entity = documents[this.pluralType][0]
    return entity
  }

  async findAll(sort = Unsorted): Promise<T[]> {
    const selector: any = {
      _id: {
        $regex: RegExp(this.type, 'i'),
      },
    }

    sort.sorts.forEach((s) => {
      selector[`data.${s.field}`] = { $gt: null }
    })

    // Adds an index to each of the fields coming from the sorting object
    // allowing the algorithm to sort by any given SortRequest, by avoiding the default index error (lack of index)

    await Promise.all(
      sort.sorts.map(
        async (s): Promise<SortRequest> => {
          await this.db.createIndex({
            index: {
              fields: [`data.${s.field}`],
            },
          })

          return sort
        },
      ),
    )

    const result = await this.db.find({
      selector,
      sort:
        sort.sorts.length > 0
          ? sort.sorts.map((s) => ({ [`data.${s.field}`]: s.direction }))
          : undefined,
    })
    const relDocs = await this.db.rel.parseRelDocs(this.type, result.docs)
    return relDocs[this.pluralType]
  }

  async count(): Promise<number> {
    const result = await this.findAll()
    return result.length
  }

  async search(criteria: any): Promise<T[]> {
    const response = await this.db.find({
      selector: {
        $and: [
          {
            _id: {
              $regex: RegExp(this.type, 'i'),
            },
          },
          { ...criteria.selector },
        ],
      },
    })
    const data = await this.db.rel.parseRelDocs(this.type, response.docs)
    return data[this.pluralType]
  }

  async save(entity: T): Promise<T> {
    const currentTime = new Date().toISOString()

    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.rel.save(this.type, {
      id: uuidv4(),
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
        id,
        rev,
        ...dataToSave,
        updatedAt: new Date().toISOString(),
      }

      await this.db.rel.save(this.type, entityToUpdate)
      return this.find(entity.id)
    } catch (error) {
      return this.save(entity)
    }
  }

  async delete(entity: T): Promise<T> {
    const entityToDelete = await this.find(entity.id)
    await this.db.rel.del(this.type, entity)
    return entityToDelete
  }
}
