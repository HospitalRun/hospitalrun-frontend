/* eslint "@typescript-eslint/camelcase": "off" */
import { v4 as uuidv4 } from 'uuid'
import AbstractDBModel from '../../model/AbstractDBModel'
import PageRequest from './PageRequest'
import Page from './Page'
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

  async pagedFindAll(pageRequest: PageRequest, sortRequest = Unsorted): Promise<Page<T>> {
    return this.pagedSearch(
      { selector: { _id: { $gt: pageRequest?.startKey } } },
      pageRequest,
      sortRequest,
    )
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

  async pagedSearch(
    criteria: any,
    pageRequest: PageRequest,
    sortRequest = Unsorted,
  ): Promise<Page<T>> {
    // eslint-disable-next-line
    criteria.selector._id = { $gt: pageRequest?.startKey }
    criteria.selector.requestedOn = { $gt: null }
    const allCriteria = {
      ...criteria,
      limit: pageRequest?.size,
      // if the page request has a start key included, then do not use skip due to its performance drawbacks
      // documented here: https://pouchdb.com/2014/04/14/pagination-strategies-with-pouchdb.html
      // if the start key was provided, make the skip 1. This will get the next document after the one with the given id defined
      // by the start key
      skip: pageRequest && !pageRequest.startKey ? pageRequest.size * pageRequest.number : 1,
      sort: sortRequest.sorts.length > 0 ? sortRequest.sorts.map((s) => s.field) : undefined,
    }

    const info = await this.db.allDocs({ limit: 0 })
    const result = await this.db.find(allCriteria)

    const rows = result.docs.map(mapDocument)
    const page = new Page<T>(rows, info.total_rows, rows.length, pageRequest.number)

    const lastPageNumber =
      Math.floor(info.total_rows / pageRequest.size) + (info.total_rows % pageRequest.size)

    // if it's not the last page, calculate the next page
    if (lastPageNumber !== pageRequest.number + 1) {
      // add the current start key to the previous start keys list
      // this is to keep track of the previous start key in order to do "linked list paging"
      // for performance reasons
      // the current page's start key will become the previous start key
      const previousStartKeys = pageRequest.previousStartKeys || []
      if (pageRequest.startKey) {
        previousStartKeys.push(pageRequest.startKey)
      }

      page.getNextPage = async () =>
        this.pagedSearch(
          criteria,
          {
            size: pageRequest.size,
            // the start key is the last row returned on the current page
            startKey: rows[rows.length - 1].id,
            previousStartKeys,
            number: pageRequest.number + 1,
          },
          sortRequest,
        ) as Promise<Page<T>>
    }

    // if it's not the first page, calculate the previous page
    if (pageRequest.number !== 0) {
      // pop a start key off the list to get the previous start key
      const previousStartKey = pageRequest.previousStartKeys?.pop()
      page.getPreviousPage = async () =>
        this.pagedSearch(
          criteria,
          {
            size: pageRequest.size,
            number: pageRequest.number - 1,
            startKey: previousStartKey,
            previousStartKeys: pageRequest.previousStartKeys,
          },
          sortRequest,
        ) as Promise<Page<T>>
    }

    return page
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
