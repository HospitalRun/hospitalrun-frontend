import { useQuery } from 'react-query'

import PricingItemRepository from '../../shared/db/PricingItemRepository'
import { PricingItem } from '../../shared/model/PricingItem'

function pricingItem(_: any, pricingItemId: string): Promise<PricingItem> {
  return PricingItemRepository.find(pricingItemId)
}

export default function usePricingItem(pricingItemId: string) {
  return useQuery(['pricingItem', pricingItemId], pricingItem)
}
