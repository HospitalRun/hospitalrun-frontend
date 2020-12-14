export default interface PricingItemSearchRequests {
  name: string
  category: 'imaging' | 'lab' | 'procedure' | 'ward' | 'all'
}
