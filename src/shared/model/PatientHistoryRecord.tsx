export enum HistoryRecordType {
  APPOINTMENT = 'Appointment',
  LAB = 'Lab',
}

export interface PatientHistoryRecord {
  date: Date
  type: HistoryRecordType
  info: string
  recordId: string
}
