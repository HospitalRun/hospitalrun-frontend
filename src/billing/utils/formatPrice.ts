export const formatPrice = (price?: number) =>
  price === undefined ? '' : Intl.NumberFormat().format(price)
