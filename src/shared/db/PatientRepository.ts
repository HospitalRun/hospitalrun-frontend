import escapeStringRegexp from 'escape-string-regexp'

import { relationalDb } from '../config/pouchdb'
import Appointment from '../model/Appointment'
import Lab from '../model/Lab'
import Medication from '../model/Medication'
import Patient from '../model/Patient'
import generateCode from '../util/generateCode'
import Repository from './Repository'

class PatientRepository extends Repository<Patient> {
  constructor() {
    super('patient', relationalDb)
    relationalDb.createIndex({
      index: { fields: ['_id', 'data.fullName', 'data.code'] },
    })
  }

  async search(text: string): Promise<Patient[]> {
    const escapedString = escapeStringRegexp(text)
    return super.search({
      selector: {
        $or: [
          {
            'data.fullName': {
              $regex: RegExp(escapedString, 'i'),
            },
          },
          {
            'data.code': text,
          },
        ],
      },
    })
  }

  async save(entity: Patient): Promise<Patient> {
    const patientCode = generateCode('P')
    entity.code = patientCode
    const saveResult = await super.save(entity)
    return this.find(saveResult.id)
  }

  async createIndex() {
    return this.db.createIndex({
      index: { fields: ['index'] },
    })
  }

  async getAppointments(patientId: string): Promise<Appointment[]> {
    const result = await this.db.rel.findHasMany('appointment', 'patient', patientId)
    return result.appointments
  }

  async getLabs(patientId: string): Promise<Lab[]> {
    const result = await this.db.rel.findHasMany('lab', 'patient', patientId)
    return result.labs
  }

  async getMedications(patientId: string): Promise<Medication[]> {
    const result = await this.db.rel.findHasMany('medication', 'patient', patientId)
    return result.medications
  }
}

export default new PatientRepository()
