import AbstractDBModel from './AbstractDBModel'

export default interface Lab extends AbstractDBModel {
  code: string
  patientId: string
  type: string
  requestedBy: string
  notes?: string
  result?: string
  status: 'requested' | 'completed' | 'canceled'
  requestedOn: string
  completedOn?: string
  canceledOn?: string
}
