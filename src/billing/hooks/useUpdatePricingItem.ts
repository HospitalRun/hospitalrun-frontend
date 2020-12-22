import { isEmpty } from 'lodash'
import { useMutation, queryCache } from 'react-query'

import PricingItemRepository from '../../shared/db/PricingItemRepository'
import { PricingItem } from '../../shared/model/PricingItem'
import { validateUpdatePricingItem } from '../utils/validate-pricingItem'

function updatePricingItem(pricingItemToUpdate: PricingItem): Promise<PricingItem> {
  const updatePricingItemErrors = validateUpdatePricingItem(pricingItemToUpdate)

  if (!isEmpty(updatePricingItemErrors)) {
    throw updatePricingItemErrors
  }

  return PricingItemRepository.saveOrUpdate(pricingItemToUpdate)
}

export default function useUpdatePricingItem() {
  return useMutation(updatePricingItem, {
    onSuccess: async (data) => {
      queryCache.setQueryData(['pricingItem', data.id], data)
      await queryCache.invalidateQueries('pricingItems')
    },
    throwOnError: true,
  })
}
