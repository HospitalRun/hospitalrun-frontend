import { MedicationStatus } from './MedicationStatus'

export default interface MedicationSearchRequest {
  text: string
  status: MedicationStatus
}
