export enum CarePlanStatus {
  Draft = 'draft',
  Active = 'active',
  OnHold = 'on hold',
  Revoked = 'revoked',
  Completed = 'completed',
  Unknown = 'unknown',
}

export enum CarePlanIntent {
  Proposal = 'proposal',
  Plan = 'plan',
  Order = 'order',
  Option = 'option',
}

export default interface CarePlan {
  id: string
  status: CarePlanStatus
  intent: CarePlanIntent
  title: string
  description: string
  startDate: string
  endDate: string
  createdOn: string
  diagnosisId: string
  note: string
}
