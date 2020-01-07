import Patient from '../model/Patient'

const getNamePartString = (namePart: string | undefined) => {
  if (!namePart) {
    return ''
  }

  return namePart
}

export function getPatientName(givenName?: string, familyName?: string, suffix?: string) {
  const givenNameFormatted = getNamePartString(givenName)
  const familyNameFormatted = getNamePartString(familyName)
  const suffixFormatted = getNamePartString(suffix)
  return `${givenNameFormatted} ${familyNameFormatted} ${suffixFormatted}`.trim()
}

export function getPatientFullName(patient: Patient): string {
  if (!patient) {
    return ''
  }

  return getPatientName(patient.givenName, patient.familyName, patient.suffix)
}
