import { capitalize } from 'lodash'

import { relationalDb } from '../config/pouchdb'
import { PricingItem } from '../model/PricingItem'
import Repository from './Repository'
import SortRequest from './SortRequest'

interface SearchContainer {
  name: string
  category: 'imaging' | 'lab' | 'procedure' | 'ward' | 'all'
  defaultSortRequest: SortRequest
}

class PricingItemRepository extends Repository<PricingItem> {
  constructor() {
    super('pricingItem', relationalDb)
  }

  async save(entity: PricingItem): Promise<PricingItem> {
    if (!entity.type) {
      if (entity.category === 'imaging' || entity.category === 'lab') {
        entity.type = `${capitalize(entity.category)} Procedure`
      }
    }

    return super.save(entity)
  }

  async search(container: SearchContainer): Promise<PricingItem[]> {
    const selector = {
      $and: [
        {
          'data.name': {
            $regex: RegExp(container.name, 'i'),
          },
        },
        ...(container.category !== 'all' ? [{ 'data.category': container.category }] : [undefined]),
      ],
    }

    return super.search({
      selector,
    })
  }
}

export default new PricingItemRepository()
