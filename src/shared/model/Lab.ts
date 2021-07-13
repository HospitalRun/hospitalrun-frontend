import AbstractDBModel from './AbstractDBModel'
import Note from './Note'

export default interface Lab extends AbstractDBModel {
  code: string
  patient: string
  type: string
  requestedBy: string
  notes?: Note[]
  result?: string
  status: 'requested' | 'completed' | 'canceled'
  requestedOn: string
  completedOn?: string
  canceledOn?: string
  visitId?: string
}
