import Lab from 'model/Lab'
import Repository from './Repository'
import { labs } from '../../config/pouchdb'

interface SearchContainer {
  text: string
  status: string
}
export class LabRepository extends Repository<Lab> {
  constructor() {
    super(labs)
    labs.createIndex({
      index: { fields: ['requestedOn', 'type', 'status'] },
    })
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
