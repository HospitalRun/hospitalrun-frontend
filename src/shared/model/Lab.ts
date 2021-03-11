import AbstractDBModel from './AbstractDBModel'

export default interface Lab extends AbstractDBModel {
  code: string
  patient: string
  type: string
  requestedBy: string
  notes?: string[]
  result?: string
  status: 'requested' | 'completed' | 'canceled'
  requestedOn: string
  completedOn?: string
  canceledOn?: string
  visitId?: string
}
