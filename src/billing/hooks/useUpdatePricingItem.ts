import { useMutation, queryCache } from 'react-query'

import PricingItemRepository from '../../shared/db/PricingItemRepository'
import { PricingItem } from '../../shared/model/PricingItem'

function updatePricingItem(pricingItemToUpdate: PricingItem): Promise<PricingItem> {
  return PricingItemRepository.saveOrUpdate(pricingItemToUpdate)
}

export default function useUpdatePricingItem() {
  return useMutation(updatePricingItem, {
    onSuccess: async (data) => {
      queryCache.setQueryData(['pricingItem', data.id], data)
      await queryCache.invalidateQueries('pricingItems')
    },
  })
}
