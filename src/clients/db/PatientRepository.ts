import escapeStringRegexp from 'escape-string-regexp'

import { relationalDb } from '../../config/pouchdb'
import Appointment from '../../model/Appointment'
import Patient from '../../model/Patient'
import generateCode from '../../util/generateCode'
import Repository from './Repository'
import Lab from "../../model/Lab";

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

  // async searchPaged(
  //   text: string,
  //   pageRequest: PageRequest = UnpagedRequest,
  //   sortRequest: SortRequest = Unsorted,
  // ): Promise<Page<Patient>> {
  //   const selector: any = {
  //     $or: [
  //       {
  //         'data.fullName': {
  //           $regex: RegExp(text, 'i'),
  //         },
  //       },
  //       {
  //         'data.code': text,
  //       },
  //     ],
  //   }
  //   sortRequest.sorts.forEach((s) => {
  //     selector[s.field] = { $gt: null }
  //   })
  //
  //   const result = await super
  //     .search({
  //       selector,
  //       limit: pageRequest.size ? pageRequest.size + 1 : undefined,
  //       skip:
  //         pageRequest.number && pageRequest.size ? (pageRequest.number - 1) * pageRequest.size : 0,
  //       sort:
  //         sortRequest.sorts.length > 0
  //           ? sortRequest.sorts.map((s) => ({ [s.field]: s.direction }))
  //           : undefined,
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       return err
  //     })
  //
  //   const pagedResult: Page<Patient> = {
  //     content: result.slice(
  //       0,
  //       pageRequest.size
  //         ? result.length < pageRequest.size
  //           ? result.length
  //           : pageRequest.size
  //         : result.length,
  //     ),
  //     pageRequest,
  //     hasNext: pageRequest.size !== undefined && result.length === pageRequest.size + 1,
  //     hasPrevious: pageRequest.number !== undefined && pageRequest.number > 1,
  //   }
  //
  //   return pagedResult
  // }

  async save(entity: Patient): Promise<Patient> {
    const patientCode = generateCode('P')
    entity.code = patientCode
    const saveResult = await relationalDb.rel.save('patient', entity)
    return this.find(saveResult.id)
  }

  async createIndex() {
    return this.db.createIndex({
      index: { fields: ['index'] },
    })
  }

  async getAppointments(patientId: string): Promise<Appointment[]> {
    const result = await this.db.rel.findHasMany('appointment', 'patient', patientId)
    console.log(result)
    return result.appointments
  }

  async getLabs(patientId: string): Promise<Lab[]> {
    const result = await this.db.rel.findHasMany('lab', 'patient', patientId)
    return result.labs
  }
}

export default new PatientRepository()
