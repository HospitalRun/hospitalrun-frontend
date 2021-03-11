import MedicationSearchRequest from '../../medications/models/MedicationSearchRequest'
import { relationalDb } from '../config/pouchdb'
import Medication from '../model/Medication'
import Repository from './Repository'
import SortRequest from './SortRequest'

interface SearchContainer extends MedicationSearchRequest {
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
              'data.medication': searchValue,
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
