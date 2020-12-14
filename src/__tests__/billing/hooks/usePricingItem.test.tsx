import { act, renderHook } from '@testing-library/react-hooks'

import usePricingItem from '../../../billing/hooks/usePricingItem'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('Use Pricing Item', () => {
  const expectedPricingItemId = 'pricing item id'
  const expectedPricingItem = {
    id: expectedPricingItemId,
  } as PricingItem

  jest.spyOn(PricingItemRepository, 'find').mockResolvedValue(expectedPricingItem)

  it('should return a pricing item by id', async () => {
    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => usePricingItem(expectedPricingItemId))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(PricingItemRepository.find).toHaveBeenCalledTimes(1)
    expect(PricingItemRepository.find).toHaveBeenCalledWith(expectedPricingItemId)
    expect(actualData).toEqual(expectedPricingItem)
  })
})
