import AbstractDBModel from './AbstractDBModel'

export default interface Incident extends AbstractDBModel {
  reportedBy: string
  reportedOn: string
  code: string
  date: string
  department: string
  category: string
  categoryItem: string
  description: string
  status: 'reported' | 'resolved'
  resolvedOn: string
  patient?: string
}
