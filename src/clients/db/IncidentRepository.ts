import { incidents } from '../../config/pouchdb'
import Incident from '../../model/Incident'
import Repository from './Repository'

class IncidentRepository extends Repository<Incident> {
  constructor() {
    super(incidents)
  }
}

export default new IncidentRepository()
