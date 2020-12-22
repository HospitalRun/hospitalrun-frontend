export type PricingItemCategoryFilter = 'imaging' | 'lab' | 'procedure' | 'ward' | 'all'

export default interface PricingItemSearchRequests {
  text: string
  category: 'imaging' | 'lab' | 'procedure' | 'ward' | 'all'
}
