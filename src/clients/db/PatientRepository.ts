import escapeStringRegexp from 'escape-string-regexp'
import Patient from '../../model/Patient'
import generateCode from '../../util/generateCode'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'

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
    const patientCode = generateCode('P')
    entity.code = patientCode
    return super.save(entity)
  }
}

export default new PatientRepository()
