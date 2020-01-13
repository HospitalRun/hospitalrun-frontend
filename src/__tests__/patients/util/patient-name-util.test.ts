import { getPatientFullName, getPatientName } from 'patients/util/patient-name-util'
import Patient from 'model/Patient'

describe('patient name util', () => {
  describe('getPatientName', () => {
    it('should build the patients name when three different type of names are passed in', () => {
      const expectedGiven = 'given'
      const expectedFamily = 'family'
      const expectedSuffix = 'suffix'

      const expectedFullName = `${expectedGiven} ${expectedFamily} ${expectedSuffix}`

      const actualFullName = getPatientName(expectedGiven, expectedFamily, expectedSuffix)

      expect(actualFullName).toEqual(expectedFullName)
    })

    it('should properly build the name if the given name part is undefined', () => {
      const expectedFamily = 'family'
      const expectedSuffix = 'suffix'

      const expectedFullName = `${expectedFamily} ${expectedSuffix}`

      const actualFullName = getPatientName(undefined, expectedFamily, expectedSuffix)

      expect(actualFullName).toEqual(expectedFullName)
    })

    it('should properly build the name if family name part is undefined', () => {
      const expectedGiven = 'given'
      const expectedSuffix = 'suffix'

      const expectedFullName = `${expectedGiven} ${expectedSuffix}`

      const actualFullName = getPatientName(expectedGiven, undefined, expectedSuffix)

      expect(actualFullName).toEqual(expectedFullName)
    })

    it('should properly build the name if one of the suffix name part is undefined', () => {
      const expectedGiven = 'given'
      const expectedFamily = 'suffix'

      const expectedFullName = `${expectedGiven} ${expectedFamily}`

      const actualFullName = getPatientName(expectedGiven, expectedFamily, undefined)

      expect(actualFullName).toEqual(expectedFullName)
    })
  })

  describe('getPatientFullName', () => {
    const patient = {
      givenName: 'given',
      familyName: 'family',
      suffix: 'suffix',
    } as Patient

    const expectedFullName = `${patient.givenName} ${patient.familyName} ${patient.suffix}`

    const actualFullName = getPatientFullName(patient)

    expect(actualFullName).toEqual(expectedFullName)
  })
})
