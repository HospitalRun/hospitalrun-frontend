export enum DiagnosisStatus {
  Active = 'active',
  Recurrence = 'recurrence',
  Relapse = 'relapse',
  Inactive = 'inactive',
  Remission = 'remisison',
  Resolved = 'resolved',
}

export default interface Diagnosis {
  id: string
  name: string
  diagnosisDate: string
  onsetDate: string
  abatementDate: string
  status: DiagnosisStatus
  note: string
  visit: string
}
