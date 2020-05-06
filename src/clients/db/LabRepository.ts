import Lab from 'model/Lab'
import generateCode from '../../util/generateCode'
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
          $or: [
            {
              type: searchValue,
            },
            {
              code: searchValue,
            },
          ],
        },
        ...(container.status !== 'all' ? [{ status: container.status }] : [undefined]),
      ].filter((x) => x !== undefined),
      sorts: container.defaultSortRequest,
    }

    return super.search({
      selector,
    })
  }

  async save(entity: Lab): Promise<Lab> {
    const labCode = generateCode('L')
    entity.code = labCode
    return super.save(entity)
  }

  async findAllByPatientId(patientId: string): Promise<Lab[]> {
    return super.search({
      selector: {
        $and: [
          {
            patientId,
          },
        ],
      },
    })
  }
}

export default new LabRepository()
