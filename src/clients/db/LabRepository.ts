import Lab from 'model/Lab'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'
import SortRequest from './SortRequest'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  sortRequest: SortRequest
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
        {
          status: container.status,
        },
      ],
      sorts: container.sortRequest.sorts,
    }

    if (container.status === 'all') {
      selector.$and.splice(1, 1)
    }

    return super.search({
      selector,
    })
  }
}

export default new LabRepository()
