/* eslint "@typescript-eslint/camelcase": "off" */
import { getTime } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
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
    const allDocs = await this.db.allDocs({
      include_docs: true,
    })

    return allDocs.rows.map(mapRow)
  }

  async save(entity: T): Promise<T> {
    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.put({ _id: uuidv4(), ...valuesToSave })
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
