import Repository from './Repository'
import { incidents } from '../../config/pouchdb'
import Incident from '../../model/Incident'

export class IncidentRepository extends Repository<Incident> {
  constructor() {
    super(incidents)
  }
}

export default new IncidentRepository()
