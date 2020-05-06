import Lab from 'model/Lab'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'
import SortRequest from './SortRequest'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}
export class LabRepository extends Repository<Lab> {
  constructor() {
    super(labs)
  }

  async search(container: SearchContainer): Promise<Lab[]> {
    const searchValue = { $regex: RegExp(container.text, 'i') }
    const selector = {
      $and: [
        {
          type: searchValue,
        },
        ...(container.status !== 'all' ? [{ status: container.status }] : [undefined]),
      ].filter((x) => x !== undefined),
      sorts: container.defaultSortRequest,
    }

    return super.search({
      selector,
    })
  }
}

export default new LabRepository()
