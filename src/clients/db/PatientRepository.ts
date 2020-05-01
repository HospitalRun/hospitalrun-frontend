import escapeStringRegexp from 'escape-string-regexp'
import shortid from 'shortid'
import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'

const formatPatientCode = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`

const getPatientCode = (): string => formatPatientCode('P-', shortid.generate())

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
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

  async save(entity: Patient): Promise<Patient> {
    const patientCode = getPatientCode()
    entity.code = patientCode
    return super.save(entity)
  }
}

export default new PatientRepository()
