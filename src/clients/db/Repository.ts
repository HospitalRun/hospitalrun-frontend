/* eslint "@typescript-eslint/camelcase": "off" */
import { v4 as uuidv4 } from 'uuid'
import Page from 'clients/Page'
import AbstractDBModel from '../../model/AbstractDBModel'
import { Unsorted } from './SortRequest'
import PageRequest, { UnpagedRequest } from './PageRequest'

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

    const result = await this.db.find({
      selector,
      sort: sort.sorts.length > 0 ? sort.sorts.map((s) => ({ [s.field]: s.direction })) : undefined,
    })

    return result.docs.map(mapDocument)
  }

  async findAllPaged(sort = Unsorted, pageRequest: PageRequest = UnpagedRequest): Promise<Page<T>> {
    const selector: any = {
      _id: { $gt: null },
    }
    if (pageRequest.direction === 'next') {
      sort.sorts.forEach((s) => {
        selector[s.field] = {
          $gte:
            pageRequest.nextPageInfo && pageRequest.nextPageInfo[s.field]
              ? pageRequest.nextPageInfo[s.field]
              : null,
        }
      })
    } else if (pageRequest.direction === 'previous') {
      sort.sorts.forEach((s) => {
        s.direction = s.direction === 'asc' ? 'desc' : 'asc'
        selector[s.field] = {
          $lte:
            pageRequest.nextPageInfo && pageRequest.nextPageInfo[s.field]
              ? pageRequest.nextPageInfo[s.field]
              : null,
        }
      })
    }

    const result = await this.db.find({
      selector,
      sort: sort.sorts.length > 0 ? sort.sorts.map((s) => ({ [s.field]: s.direction })) : undefined,
      limit: pageRequest.size ? pageRequest.size + 1 : undefined,
      skip: pageRequest.direction === 'previous' ? pageRequest.size : undefined,
    })
    const mappedResult = result.docs.map(mapDocument)

    if (pageRequest.direction === 'previous') {
      mappedResult.reverse()
    }
    const nextPageInfo: { [key: string]: string } = {}

    if (mappedResult.length > 0) {
      sort.sorts.forEach((s) => {
        nextPageInfo[s.field] = mappedResult[mappedResult.length - 1][s.field]
      })
    }

    const pagedResult: Page<T> = {
      content:
        pageRequest.size !== undefined && mappedResult.length === pageRequest.size + 1
          ? mappedResult.slice(0, mappedResult.length - 1)
          : mappedResult,
      hasNext: pageRequest.size !== undefined && mappedResult.length === pageRequest.size + 1,
      // hasPrevious: pageRequest.number !== undefined && pageRequest.number > 1,
      hasPrevious: false,
      pageRequest: {
        size: pageRequest.size,
        number: pageRequest.number,
        nextPageInfo,
        direction: null,
      },
    }
    return pagedResult
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
