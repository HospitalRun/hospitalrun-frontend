import { capitalize, isEmpty } from 'lodash'
import { useMutation, queryCache } from 'react-query'

import PricingItemRepository from '../../shared/db/PricingItemRepository'
import { PricingItem } from '../../shared/model/PricingItem'
import { validateNewPricingItem } from '../utils/validate-pricingItem'

function addPricingItem(newPricingItem: PricingItem): Promise<PricingItem> {
  const addPricingItemErrors = validateNewPricingItem(newPricingItem)

  if (!isEmpty(addPricingItemErrors)) {
    throw addPricingItemErrors
  }

  if (!newPricingItem.type) {
    if (newPricingItem.category === 'imaging' || newPricingItem.category === 'lab') {
      newPricingItem.type = `${capitalize(newPricingItem.category)} Procedure`
    }
  }

  return PricingItemRepository.save(newPricingItem)
}

export default function useAddPricingItem() {
  return useMutation(addPricingItem, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('pricingItems')
    },
    throwOnError: true,
  })
}
