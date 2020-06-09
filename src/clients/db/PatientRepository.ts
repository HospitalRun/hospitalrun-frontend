import escapeStringRegexp from 'escape-string-regexp'

import { patients } from '../../config/pouchdb'
import Patient from '../../model/Patient'
import generateCode from '../../util/generateCode'
import Page from '../Page'
import PageRequest, { UnpagedRequest } from './PageRequest'
import Repository from './Repository'
import SortRequest, { Unsorted } from './SortRequest'

class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
    patients.createIndex({
      index: { fields: ['index'] },
    })
  }

  async search(text: string): Promise<Patient[]> {
    const escapedString = escapeStringRegexp(text)
    return super.search({
      selector: {
        $or: [
          {
            fullName: {
              $regex: RegExp(escapedString, 'i'),
            },
          },
          {
            code: text,
          },
        ],
      },
    })
  }

  async searchPaged(
    text: string,
    pageRequest: PageRequest = UnpagedRequest,
    sortRequest: SortRequest = Unsorted,
  ): Promise<Page<Patient>> {
    const selector: any = {
      $or: [
        {
          fullName: {
            $regex: RegExp(text, 'i'),
          },
        },
        {
          code: text,
        },
      ],
    }
    sortRequest.sorts.forEach((s) => {
      selector[s.field] = { $gt: null }
    })

    const result = await super
      .search({
        selector,
        limit: pageRequest.size ? pageRequest.size + 1 : undefined,
        skip:
          pageRequest.number && pageRequest.size ? (pageRequest.number - 1) * pageRequest.size : 0,
        sort:
          sortRequest.sorts.length > 0
            ? sortRequest.sorts.map((s) => ({ [s.field]: s.direction }))
            : undefined,
      })
      .catch((err) => {
        console.log(err)
        return err
      })

    const pagedResult: Page<Patient> = {
      content: result.slice(
        0,
        pageRequest.size
          ? result.length < pageRequest.size
            ? result.length
            : pageRequest.size
          : result.length,
      ),
      pageRequest,
      hasNext: pageRequest.size !== undefined && result.length === pageRequest.size + 1,
      hasPrevious: pageRequest.number !== undefined && pageRequest.number > 1,
    }

    return pagedResult
  }

  async save(entity: Patient): Promise<Patient> {
    const patientCode = generateCode('P')
    entity.code = patientCode
    entity.index = (entity.fullName ? entity.fullName : '') + patientCode
    return super.save(entity)
  }

  async createIndex() {
    return this.db.createIndex({
      index: { fields: ['index'] },
    })
  }
}

export default new PatientRepository()
