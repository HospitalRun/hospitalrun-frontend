import { act } from '@testing-library/react-hooks'

import useUpdatePricingItem from '../../../billing/hooks/useUpdatePricingItem'
import { PricingItemError } from '../../../billing/utils/validate-pricingItem'
import * as validatePricingItem from '../../../billing/utils/validate-pricingItem'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Update Pricing Item', () => {
  const expectedPricingItem = {
    name: 'pricing item',
    category: 'imaging',
    price: 100,
  } as PricingItem

  jest.spyOn(PricingItemRepository, 'saveOrUpdate').mockResolvedValue(expectedPricingItem)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update pricing item', async () => {
    let actualData: any

    await act(async () => {
      actualData = await executeMutation(() => useUpdatePricingItem(), expectedPricingItem)
    })

    expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPricingItem)
    expect(actualData).toEqual(expectedPricingItem)
  })

  it('should throw error if validation fails', async () => {
    expect.hasAssertions()

    const expectedErrors = {
      message: 'error message',
      name: 'error name',
      price: 'error price',
      category: 'error category',
    } as PricingItemError

    jest.spyOn(validatePricingItem, 'validateUpdatePricingItem').mockReturnValue(expectedErrors)

    try {
      await executeMutation(() => useUpdatePricingItem(), expectedPricingItem)
    } catch (e) {
      expect(e).toEqual(expectedErrors)
      expect(PricingItemRepository.saveOrUpdate).not.toHaveBeenCalled()
    }
  })
})
