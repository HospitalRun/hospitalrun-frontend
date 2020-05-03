import Lab from 'model/Lab'
import generateCode from '../../util/generateCode'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'

export class LabRepository extends Repository<Lab> {
  constructor() {
    super(labs)
    labs.createIndex({
      index: { fields: ['requestedOn'] },
    })
  }

  async save(entity: Lab): Promise<Lab> {
    const labCode = generateCode('L')
    entity.code = labCode
    return super.save(entity)
  }
}

export default new LabRepository()
