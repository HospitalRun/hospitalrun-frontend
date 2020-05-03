import Lab from 'model/Lab'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'

export class LabRepository extends Repository<Lab> {
  constructor() {
    super(labs)
    labs.createIndex({
      index: { fields: ['requestedOn'] },
    })
  }

  async findAllByPatientId(patientId: string): Promise<Lab[]> {
    return super.search({
      selector: {
        $and: [
          {
            patientId,
          },
        ],
      },
    })
  }
}

export default new LabRepository()
