import Patient from '../../shared/model/Patient'

export function isPossibleDuplicatePatient(newPatient: Patient, existingPatient: Patient) {
  if (
    newPatient.givenName === existingPatient.givenName &&
    newPatient.familyName === existingPatient.familyName &&
    newPatient.sex === existingPatient.sex &&
    newPatient.dateOfBirth === existingPatient.dateOfBirth
  ) {
    return newPatient
  }
  return null
}
