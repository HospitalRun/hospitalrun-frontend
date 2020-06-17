import Patient from '../../model/Patient'
import { getPatientName } from './patient-name-util'

/**
 * Add full name. Get rid of empty phone numbers, emails, and addresses.
 * @param patient
 */
const cleanupPatient = (patient: Patient) => {
  const newPatient = { ...patient }

  const { givenName, familyName, suffix } = patient
  newPatient.fullName = getPatientName(givenName, familyName, suffix)

  type cik = 'phoneNumbers' | 'emails' | 'addresses'
  const contactInformationKeys: cik[] = ['phoneNumbers', 'emails', 'addresses']
  contactInformationKeys.forEach((key) => {
    if (key in newPatient) {
      const nonEmpty = newPatient[key]
        .filter(({ value }) => value.trim() !== '')
        .map((entry) => {
          const newValue = entry.value.trim()
          if ('type' in entry) {
            return { id: entry.id, value: newValue, type: entry.type }
          }
          return { id: entry.id, value: newValue }
        })

      if (nonEmpty.length > 0) {
        newPatient[key] = nonEmpty
      } else {
        delete newPatient[key]
      }
    }
  })

  return newPatient
}

export { cleanupPatient }
