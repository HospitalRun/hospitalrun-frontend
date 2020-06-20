import { labs } from '../../config/pouchdb'
import Lab from '../../model/Lab'
import generateCode from '../../util/generateCode'
import Page from '../Page'
import PageRequest, { UnpagedRequest } from './PageRequest'
import Repository from './Repository'
import SortRequest, { Unsorted } from './SortRequest'

interface SearchContainer {
  text: string
  status: 'requested' | 'completed' | 'canceled' | 'all'
  defaultSortRequest: SortRequest
}
class LabRepository extends Repository<Lab> {
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

  async searchPaged(
    container: SearchContainer,
    pageRequest: PageRequest = UnpagedRequest,
    sortRequest: SortRequest = Unsorted,
  ): Promise<Page<Lab>> {
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

    const result = await super
      .search({
        selector,
        limit: pageRequest.size ? pageRequest.size + 1 : undefined,
        skip:
          pageRequest.number && pageRequest.size ? (pageRequest.number - 1) * pageRequest.size : 0,
        sort:
          sortRequest.sorts.length > 0
            ? sortRequest.sorts.map((s) => ({ [s.field]: s.direction }))
            : undefined,
      })
      .catch((err) => {
        console.log(err)
        return err
      })

    const pagedResult: Page<Lab> = {
      content: result.slice(
        0,
        pageRequest.size
          ? result.length < pageRequest.size
            ? result.length
            : pageRequest.size
          : result.length,
      ),
      pageRequest,
      hasNext: pageRequest.size !== undefined && result.length === pageRequest.size + 1,
      hasPrevious: pageRequest.number !== undefined && pageRequest.number > 1,
    }

    return pagedResult
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
