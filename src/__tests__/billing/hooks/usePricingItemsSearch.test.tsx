import { act, renderHook } from '@testing-library/react-hooks'

import usePricingItemsSearch from '../../../billing/hooks/usePricingItemsSearch'
import PricingItemSearchRequests from '../../../billing/model/PricingItemSearchRequest'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('Use Pricing Items Search', () => {
  const expectedPricingItem = [
    {
      name: 'pricing item',
    },
  ] as PricingItem[]

  jest.spyOn(PricingItemRepository, 'findAll').mockResolvedValue(expectedPricingItem)
  jest.spyOn(PricingItemRepository, 'search').mockResolvedValue(expectedPricingItem)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should find all if no criteria is provided', async () => {
    const pricingItemsSearchRequest = {
      text: '',
      category: 'all',
    } as PricingItemSearchRequests

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => usePricingItemsSearch(pricingItemsSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(PricingItemRepository.search).not.toHaveBeenCalled()
    expect(PricingItemRepository.findAll).toHaveBeenCalledTimes(1)
    expect(actualData).toEqual(expectedPricingItem)
  })

  it('should search for pricing items', async () => {
    const pricingItemsSearchRequest = {
      text: 'pricing item',
    } as PricingItemSearchRequests

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => usePricingItemsSearch(pricingItemsSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(PricingItemRepository.findAll).not.toHaveBeenCalled()
    expect(PricingItemRepository.search).toHaveBeenCalledWith(
      expect.objectContaining(pricingItemsSearchRequest),
    )
    expect(actualData).toEqual(expectedPricingItem)
  })
})
