import { act } from '@testing-library/react-hooks'

import useUpdatePricingItem from '../../../billing/hooks/useUpdatePricingItem'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Update Pricing Item', () => {
  const expectedPricingItem = {
    name: 'pricing item',
  } as PricingItem

  jest.spyOn(PricingItemRepository, 'saveOrUpdate').mockResolvedValue(expectedPricingItem)

  it('should update pricing item', async () => {
    let actualData: any

    await act(async () => {
      actualData = await executeMutation(() => useUpdatePricingItem(), expectedPricingItem)
    })

    expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPricingItem)
    expect(actualData).toEqual(expectedPricingItem)
  })
})
