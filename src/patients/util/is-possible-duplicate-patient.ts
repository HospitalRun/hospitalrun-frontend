import Patient from '../../shared/model/Patient'

export function isPossibleDuplicatePatient(newPatient: Patient, existingPatient: Patient) {
  return (
    newPatient.givenName === existingPatient.givenName &&
    newPatient.familyName === existingPatient.familyName &&
    newPatient.sex === existingPatient.sex &&
    newPatient.dateOfBirth === existingPatient.dateOfBirth
  )
}
