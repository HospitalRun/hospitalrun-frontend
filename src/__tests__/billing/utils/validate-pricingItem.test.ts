import { isEmpty } from 'lodash'

import * as validateUtil from '../../../billing/utils/validate-pricingItem'
import { PricingItemError } from '../../../billing/utils/validate-pricingItem'
import { PricingItem } from '../../../shared/model/PricingItem'

describe('Validate Pricing item', () => {
  const validPricingItem = {
    name: 'expected name',
    category: 'imaging',
    price: 100,
  } as PricingItem

  describe('New Pricing Item', () => {
    it('should validate a new pricing item', () => {
      const errors = validateUtil.validateNewPricingItem(validPricingItem)

      expect(isEmpty(errors)).toBeTruthy()
    })

    it('should return erros', () => {
      const errors = validateUtil.validateNewPricingItem({} as PricingItem)

      expect(isEmpty(errors)).toBeFalsy()
      expect(errors).toEqual({
        itemName: 'billing.requests.error.nameRequired',
        category: 'billing.requests.error.categoryRequired',
        price: 'billing.requests.error.priceRequired',
        message: 'billing.requests.error.unableToAdd',
      } as PricingItemError)
    })
  })

  describe('Update Pricing Item', () => {
    it('should validate a pricing item update', () => {
      const errors = validateUtil.validateUpdatePricingItem(validPricingItem)

      expect(isEmpty(errors)).toBeTruthy()
    })

    it('should return errors', () => {
      const errors = validateUtil.validateUpdatePricingItem({} as PricingItem)

      expect(isEmpty(errors)).toBeFalsy()
      expect(errors).toEqual({
        itemName: 'billing.requests.error.nameRequired',
        category: 'billing.requests.error.categoryRequired',
        price: 'billing.requests.error.priceRequired',
        message: 'billing.requests.error.unableToUpdate',
      } as PricingItemError)
    })
  })
})
