import {
  getPatientCode,
  getPatientFullName,
  getPatientName,
} from '../../../patients/util/patient-util'
import Patient from '../../../shared/model/Patient'

describe('patient util', () => {
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

    it('should return the patients name given a patient', () => {
      const expectedFullName = `${patient.givenName} ${patient.familyName} ${patient.suffix}`

      const actualFullName = getPatientFullName(patient)

      expect(actualFullName).toEqual(expectedFullName)
    })

    it('should return a empty string given undefined', () => {
      expect(getPatientFullName(undefined)).toEqual('')
    })
  })

  describe('getPatientCode', () => {
    const patient = {
      code: 'code',
    } as Patient

    it('should return the patients code given a patient', () => {
      const actualFullName = getPatientCode(patient)

      expect(actualFullName).toEqual(patient.code)
    })

    it('should return a empty string given undefined', () => {
      expect(getPatientCode(undefined)).toEqual('')
    })
  })
})
