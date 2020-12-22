import { act } from '@testing-library/react-hooks'

import useAddPricingItem from '../../../billing/hooks/useAddPricingItem'
import { PricingItemError } from '../../../billing/utils/validate-pricingItem'
import * as validatePricingItem from '../../../billing/utils/validate-pricingItem'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Add Pricing Item', () => {
  const expectedPricingItem = {
    name: 'pricing item',
    price: 10,
    category: 'ward',
  } as PricingItem

  jest.spyOn(PricingItemRepository, 'save').mockResolvedValue(expectedPricingItem)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should save a new pricing item', async () => {
    let actualData: any
    await act(async () => {
      actualData = await executeMutation(() => useAddPricingItem(), expectedPricingItem)
    })

    expect(PricingItemRepository.save).toHaveBeenCalledTimes(1)
    expect(PricingItemRepository.save).toHaveBeenCalledWith(expectedPricingItem)
    expect(actualData).toEqual(expectedPricingItem)
  })

  it('should fill type if its not filled when category is imaging or lab', async () => {
    const expectedPricingItem1 = {
      ...expectedPricingItem,
      category: 'lab',
    } as PricingItem

    const expectedPricingItem2 = {
      ...expectedPricingItem,
      category: 'imaging',
    } as PricingItem

    await act(async () => {
      await executeMutation(() => useAddPricingItem(), expectedPricingItem1)
      await executeMutation(() => useAddPricingItem(), expectedPricingItem2)
    })

    expect(PricingItemRepository.save).toHaveBeenCalledTimes(2)
    expect(PricingItemRepository.save).toHaveBeenNthCalledWith(1, {
      ...expectedPricingItem1,
      type: 'Lab Procedure',
    })
    expect(PricingItemRepository.save).toHaveBeenNthCalledWith(2, {
      ...expectedPricingItem2,
      type: 'Imaging Procedure',
    })
  })

  it('should return errors', async () => {
    expect.hasAssertions()

    const expectedErrors = {
      message: 'error message',
      name: 'error name',
      price: 'error price',
      category: 'error category',
    } as PricingItemError

    jest.spyOn(validatePricingItem, 'validateNewPricingItem').mockReturnValue(expectedErrors)

    try {
      await executeMutation(() => useAddPricingItem(), expectedPricingItem)
    } catch (e) {
      expect(e).toEqual(expectedErrors)
      expect(PricingItemRepository.save).not.toHaveBeenCalled()
    }
  })
})
