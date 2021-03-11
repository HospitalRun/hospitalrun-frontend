import { isPossibleDuplicatePatient } from '../../../patients/util/is-possible-duplicate-patient'
import Patient from '../../../shared/model/Patient'

describe('is possible duplicate patient', () => {
  describe('isPossibleDuplicatePatient', () => {
    it('should return true when duplicate patients are passed', () => {
      const newPatient = {
        givenName: 'given',
        familyName: 'family',
        suffix: 'suffix',
      } as Patient

      const existingPatient = {
        givenName: 'given',
        familyName: 'family',
        suffix: 'suffix',
      } as Patient

      const isDuplicatePatient = isPossibleDuplicatePatient(newPatient, existingPatient)

      expect(isDuplicatePatient).toEqual(true)
    })
  })
})
