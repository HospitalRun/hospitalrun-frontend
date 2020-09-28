export type LabFilter = 'requested' | 'completed' | 'canceled' | 'all'

export default interface LabSearchRequest {
  text?: string
  status: LabFilter
}
