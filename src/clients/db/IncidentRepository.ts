import Incident from '../../model/Incident'
import Repository from './Repository'

class IncidentRepository extends Repository<Incident> {
  constructor() {
    super('incident')
  }
}

export default new IncidentRepository()
