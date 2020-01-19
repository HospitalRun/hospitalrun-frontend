/* eslint "@typescript-eslint/camelcase": "off" */
import { getTime } from 'date-fns'
import AbstractDBModel from '../../model/AbstractDBModel'

function mapRow(row: any): any {
  const { value, doc } = row
  const { id, _rev, _id, rev, ...restOfDoc } = doc
  return {
    id: _id,
    rev: value.rev,
    ...restOfDoc,
  }
}

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

  async search(criteria: any): Promise<T[]> {
    const response = await this.db.find(criteria)
    return response.docs.map(mapDocument)
  }

  async findAll(): Promise<T[]> {
    const allPatients = await this.db.allDocs({
      include_docs: true,
    })

    return allPatients.rows.map(mapRow)
  }

  async save(entity: T): Promise<T> {
    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.put({ _id: getTime(new Date()).toString(), ...valuesToSave })
    return this.find(savedEntity.id)
  }

  async saveOrUpdate(entity: T): Promise<T> {
    if (!entity.id) {
      return this.save(entity)
    }

    try {
      const existingEntity = await this.find(entity.id)
      const { id, rev, ...restOfDoc } = existingEntity
      const entityToUpdate = {
        _id: id,
        _rev: rev,
        ...restOfDoc,
        ...entity,
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
