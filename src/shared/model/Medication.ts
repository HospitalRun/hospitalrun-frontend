import AbstractDBModel from './AbstractDBModel'

export default interface Medication extends AbstractDBModel {
  requestedBy: string
  requestedOn: string
  completedOn: string
  canceledOn: string
  medication: string
  status:
    | 'draft'
    | 'active'
    | 'on hold'
    | 'canceled'
    | 'completed'
    | 'entered in error'
    | 'stopped'
    | 'unknown'
  intent:
    | 'proposal'
    | 'plan'
    | 'order'
    | 'original order'
    | 'reflex order'
    | 'filler order'
    | 'instance order'
    | 'option'
  priority: 'routine' | 'urgent' | 'asap' | 'stat'
  patient: string
  notes: string
  quantity: { value: number; unit: string }
}
