import Lab from 'model/Lab'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'

export class LabRepository extends Repository<Lab> {
  constructor() {
    super(labs)
  }
}

export default new LabRepository()
