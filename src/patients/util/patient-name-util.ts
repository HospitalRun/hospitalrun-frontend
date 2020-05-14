import Patient from '../../model/Patient'

const getNamePartString = (namePart: string | undefined) => {
  if (!namePart) {
    return ''
  }

  return namePart
}

const appendNamePart = (name: string, namePart?: string): string =>
  `${name} ${getNamePartString(namePart)}`.trim()

export function getPatientName(givenName?: string, familyName?: string, suffix?: string) {
  let name = ''
  name = appendNamePart(name, givenName)
  name = appendNamePart(name, familyName)
  name = appendNamePart(name, suffix)
  return name.trim()
}

export function getPatientFullName(patient: Patient): string {
  if (!patient) {
    return ''
  }

  return getPatientName(patient.givenName, patient.familyName, patient.suffix)
}
