import escapeStringRegexp from 'escape-string-regexp'

import Repository from 'clients/db/Repository'
import { patients } from 'config/pouchdb'
import Patient from 'model/Patient'
import generateCode from 'util/generateCode'

class PatientRepository extends Repository<Patient> {
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
