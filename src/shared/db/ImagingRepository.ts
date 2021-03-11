import { relationalDb } from '../config/pouchdb'
import Imaging from '../model/Imaging'
import generateCode from '../util/generateCode'
import Repository from './Repository'
import SortRequest from './SortRequest'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}

class ImagingRepository extends Repository<Imaging> {
  constructor() {
    super('imaging', relationalDb)
  }

  async search(container: SearchContainer): Promise<Imaging[]> {
    const searchValue = { $regex: RegExp(container.text, 'i') }
    const selector = {
      $and: [
        {
          $or: [
            {
              'data.type': searchValue,
            },
            {
              'data.code': searchValue,
            },
          ],
        },
        ...(container.status !== 'all' ? [{ 'data.status': container.status }] : [undefined]),
      ].filter((x) => x !== undefined),
      sorts: container.defaultSortRequest,
    }

    return super.search({
      selector,
    })
  }

  async save(entity: Imaging): Promise<Imaging> {
    const imagingCode = generateCode('I')
    entity.code = imagingCode
    return super.save(entity)
  }
}

export default new ImagingRepository()
