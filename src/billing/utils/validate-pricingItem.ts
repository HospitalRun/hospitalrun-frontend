import { isEmpty } from 'lodash'

import { PricingItem } from '../../shared/model/PricingItem'

export class PricingItemError extends Error {
  message: string

  itemName?: string

  price?: string

  category?: string

  constructor(message: string, itemName: string, price: string, category: string) {
    super(message)
    this.message = message
    this.itemName = itemName
    this.price = price
    this.category = category
  }
}

function validatePricingItem(pricingItem: Partial<PricingItem>): PricingItemError {
  const pricingItemError = {} as PricingItemError

  if (!pricingItem.name) {
    pricingItemError.itemName = 'billing.requests.error.nameRequired'
  }

  if (!pricingItem.price) {
    pricingItemError.price = 'billing.requests.error.priceRequired'
  }

  if (!pricingItem.category) {
    pricingItemError.category = 'billing.requests.error.categoryRequired'
  }

  return pricingItemError
}

export function validateNewPricingItem(pricingItem: Partial<PricingItem>): PricingItemError {
  const newPricingItemError = validatePricingItem(pricingItem)

  if (!isEmpty(newPricingItemError)) {
    newPricingItemError.message = 'billing.requests.error.unableToAdd'
  }

  return newPricingItemError
}

export function validateUpdatePricingItem(pricingItem: Partial<PricingItem>): PricingItemError {
  const updatePricingItemError = validatePricingItem(pricingItem)

  if (!isEmpty(updatePricingItemError)) {
    updatePricingItemError.message = 'billing.requests.error.unableToUpdate'
  }

  return updatePricingItemError
}
