import escapeStringRegexp from 'escape-string-regexp'
import shortid from 'shortid'
import Page from 'clients/Page'
import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'
import PageRequest, { UnpagedRequest } from './PageRequest'

const formatPatientCode = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`

const getPatientCode = (): string => formatPatientCode('P-', shortid.generate())

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
    patients.createIndex({
      index: { fields: ['code', 'fullName'] },
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
  ): Promise<Page<Patient>> {
    return super
      .search({
        selector: {
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
        },
        skip: pageRequest.skip,
        limit: pageRequest.limit,
      })
      .then(
        (searchedData) =>
          new Promise<Page<Patient>>((resolve) => {
            const pagedResult: Page<Patient> = {
              content: searchedData,
              pageRequest,
              hasNext: pageRequest.limit !== undefined && searchedData.length === pageRequest.limit,
              hasPrevious: pageRequest.skip > 0,
            }
            resolve(pagedResult)
          }),
      )
      .catch((err) => {
        console.log(err)
        return err
      })
  }

  async save(entity: Patient): Promise<Patient> {
    const patientCode = getPatientCode()
    entity.code = patientCode
    return super.save(entity)
  }
}

export default new PatientRepository()
