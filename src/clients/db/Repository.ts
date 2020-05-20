/* eslint "@typescript-eslint/camelcase": "off" */
import { v4 as uuidv4 } from 'uuid'

import db from '../../config/pouchdb'
import AbstractDBModel from '../../model/AbstractDBModel'
import SortRequest, { Unsorted } from './SortRequest'

function mapDocument(document: any): any {
  const { _id, _rev } = document
  console.log(document)
  return {
    id: db.rel.parseDocID(_id).id,
    rev: _rev,
    ...document.data,
  }
}
export default class Repository<T extends AbstractDBModel> {
  type: string

  constructor(type: string) {
    this.type = type
  }

  async find(id: string): Promise<T> {
    const response = await db.rel.find(this.type, id)
    return response[`${this.type}s`][0]
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
          await db.createIndex({
            index: {
              fields: [s.field],
            },
          })

          return sort
        },
      ),
    )

    const result = await db.find({
      selector,
      sort: sort.sorts.length > 0 ? sort.sorts.map((s) => ({ [s.field]: s.direction })) : undefined,
    })

    const temp = await db.rel.find('lab')
    const temp2 = await db.allDocs({ include_docs: true})
    console.log(temp)
    console.log(temp2)
    return result.docs.map(mapDocument)
  }

  async search(criteria: any): Promise<T[]> {
    const response = await db.find(criteria)
    console.log(response)
    return response.docs.map(mapDocument)
  }

  async save(entity: T): Promise<T> {
    const currentTime = new Date().toISOString()
    const { id, rev, ...valuesToSave } = entity

    let savedEntity
    if (entity.id) {
      savedEntity = await db.rel.save(this.type, {
        ...entity,
        id,
        rev,
      })
    } else {
      savedEntity = await db.rel.save(this.type, {
        id: uuidv4(),
        ...valuesToSave,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
    }

    return this.find(savedEntity.id)
  }

  async delete(entity: T): Promise<T> {
    const toDelete = await this.find(entity.id)
    await db.rel.del(this.type, toDelete)
    return this.find(entity.id)
  }
}
