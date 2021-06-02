export enum HistoryRecordType {
  APPOINTMENT = 'Appointment',
  LAB = 'Lab',
}

export interface PatientHistoryRecord {
  id: string
  date: Date
  type: HistoryRecordType
  info: string
  recordId: string
}
