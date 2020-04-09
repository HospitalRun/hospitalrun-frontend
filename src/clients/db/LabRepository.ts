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
}

export default new LabRepository()
