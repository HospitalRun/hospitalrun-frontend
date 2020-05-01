import escapeStringRegexp from 'escape-string-regexp'
import shortid from 'shortid'
import Page from 'clients/Page'
import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'
import PageRequest, { UnpagedRequest } from './PageRequest'
import SortRequest, { Unsorted } from './SortRequest'

const formatPatientCode = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`

const getPatientCode = (): string => formatPatientCode('P-', shortid.generate())

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
    patients.createIndex({
      index: { fields: ['fullName', 'code'] },
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
        limit: pageRequest.size,
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
      content: result,
      pageRequest,
      hasNext: pageRequest.size !== undefined && result.length === pageRequest.size,
      hasPrevious: pageRequest.number !== undefined && pageRequest.number > 1,
    }
    return pagedResult
  }

  async save(entity: Patient): Promise<Patient> {
    const patientCode = getPatientCode()
    entity.code = patientCode
    return super.save(entity)
  }
}

export default new PatientRepository()
