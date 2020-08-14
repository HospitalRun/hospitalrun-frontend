import { relationalDb } from '../config/pouchdb'
import Medication from '../model/Medication'
import Repository from './Repository'
import SortRequest from './SortRequest'

interface SearchContainer {
  text: string
  status:
    | 'draft'
    | 'active'
    | 'on hold'
    | 'canceled'
    | 'completed'
    | 'entered in error'
    | 'stopped'
    | 'unknown'
    | 'all'
  defaultSortRequest: SortRequest
}
class MedicationRepository extends Repository<Medication> {
  constructor() {
    super('medication', relationalDb)
  }

  async search(container: SearchContainer): Promise<Medication[]> {
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

  async save(entity: Medication): Promise<Medication> {
    return super.save(entity)
  }

  async findAllByPatientId(patientId: string): Promise<Medication[]> {
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

export default new MedicationRepository()
