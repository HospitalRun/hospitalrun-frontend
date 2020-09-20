import Diagnosis from '../../shared/model/Diagnosis'

interface AddDiagnosisError {
  message?: string
  name?: string
  diagnosisDate?: string
  onsetDate?: string
  abatementDate?: string
  status?: string
  note?: string
}

export class DiagnosisError extends Error {
  nameError?: string

  constructor(message: string, name: string) {
    super(message)
    this.nameError = name
    Object.setPrototypeOf(this, DiagnosisError.prototype)
  }
}

export default function validateDiagnosis(diagnosis: Partial<Diagnosis>) {
  const error: AddDiagnosisError = {}

  if (!diagnosis.name) {
    error.name = 'patient.diagnoses.error.nameRequired'
  }

  if (!diagnosis.diagnosisDate) {
    error.diagnosisDate = 'patient.diagnoses.error.dateRequired'
  }

  if (!diagnosis.onsetDate) {
    error.onsetDate = 'patient.diagnoses.error.dateRequired'
  }

  if (!diagnosis.abatementDate) {
    error.abatementDate = 'patient.diagnoses.error.dateRequired'
  }

  if (!diagnosis.status) {
    error.status = 'patient.diagnoses.error.statusRequired'
  }
  return error
}
