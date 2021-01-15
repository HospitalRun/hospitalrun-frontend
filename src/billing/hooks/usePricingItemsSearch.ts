import { useQuery } from 'react-query'

import PricingItemRepository from '../../shared/db/PricingItemRepository'
import SortRequest from '../../shared/db/SortRequest'
import { PricingItem } from '../../shared/model/PricingItem'
import PricingItemSearchRequests from '../model/PricingItemSearchRequest'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'createdAt',
      direction: 'desc',
    },
  ],
}

function pricingItemsSearch(
  _: any,
  pricingItemSearchRequest: PricingItemSearchRequests,
): Promise<PricingItem[]> {
  if (pricingItemSearchRequest.text?.trim() === '' && pricingItemSearchRequest.category === 'all') {
    return PricingItemRepository.findAll(defaultSortRequest)
  }

  return PricingItemRepository.search({
    ...pricingItemSearchRequest,
    defaultSortRequest,
  })
}

export default function usePricingItemsSearch(pricingItemSearchRequest: PricingItemSearchRequests) {
  return useQuery(['pricingItems', pricingItemSearchRequest], pricingItemsSearch)
}
