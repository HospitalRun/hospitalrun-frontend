import AbstractDBModel from './AbstractDBModel'

export interface PricingItem extends AbstractDBModel {
  name: string
  price: number
  expenseTo: string
  category: 'imaging' | 'lab' | 'procedure' | 'ward'
  type: string
  notes: string
  createdBy: string
}
