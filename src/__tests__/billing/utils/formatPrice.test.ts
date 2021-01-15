import { formatPrice } from '../../../billing/utils/formatPrice'

describe('Format Price', () => {
  it('should format the price when receive a number', () => {
    const price = 1234
    const result = formatPrice(price)

    expect(result).toEqual('1,234')
  })

  it('should return "" when undefined is passed as parameter', () => {
    const result = formatPrice()

    expect(result).toEqual('')
  })
})
