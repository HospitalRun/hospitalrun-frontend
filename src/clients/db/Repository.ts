/* eslint "@typescript-eslint/camelcase": "off" */

import AbstractDBModel from '../../model/AbstractDBModel'
import Search from './Search'

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

function mapRowFromSearch(row: any): any {
  const { doc } = row
  return mapDocument(doc)
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

  async search(search: Search): Promise<T[]> {
    const response = await this.db.search({
      query: search.searchString,
      fields: search.fields,
      include_docs: true,
    })

    return response.rows.map(mapRowFromSearch)
  }

  async findAll(): Promise<T[]> {
    const allPatients = await this.db.allDocs({
      include_docs: true,
    })

    return allPatients.rows.map(mapRow)
  }

  async save(entity: T): Promise<T> {
    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.post({ ...valuesToSave })
    return this.find(savedEntity.id)
  }

  async saveOrUpdate(entity: T): Promise<T> {
    const e = entity as any
    try {
      // try and get a patient, if the patient is missing it will throw an error
      // and have a status of 404.
      await this.db.get(e.id)
      const { id, rev, ...restOfDocument } = e
      const updatedDcoument = {
        _id: id,
        _rev: rev,
        ...restOfDocument,
      }

      await this.db.put(updatedDcoument)
      return this.find(e.id)
    } catch (error) {
      if (error.status !== 404) {
        throw Error(error)
      }

      return this.save(e)
    }
  }

  async delete(entity: T): Promise<T> {
    const e = entity as any
    return mapDocument(this.db.remove(e.id, e.rev))
  }
}
