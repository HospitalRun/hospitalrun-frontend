import { incidents } from '../../config/pouchdb'
import { filter } from '../../incidents/incidents-slice'
import Incident from '../../model/Incident'
import Repository from './Repository'

interface SearchContainer {
  status: filter
}
class IncidentRepository extends Repository<Incident> {
  constructor() {
    super(incidents)
  }

  async search(container: SearchContainer): Promise<Incident[]> {
    const selector = {
      $and: [...(container.status !== 'all' ? [{ status: container.status }] : [undefined])].filter(
        (x) => x !== undefined,
      ),
    }

    return super.search({
      selector,
    })
  }
}

export default new IncidentRepository()
