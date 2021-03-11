import { LabError, validateLabRequest, validateLabComplete } from '../../../labs/utils/validate-lab'
import Lab from '../../../shared/model/Lab'

describe('lab validator', () => {
  describe('validate request', () => {
    it('should not return error when fields are filled', () => {
      const lab = {
        patient: 'some patient',
        type: 'type test',
      } as Lab

      const expectedError = {} as LabError

      const actualError = validateLabRequest(lab)

      expect(actualError).toEqual(expectedError)
    })

    it('should return error when fields are missing', () => {
      const lab = {} as Lab

      const expectedError = {
        patient: 'labs.requests.error.patientRequired',
        type: 'labs.requests.error.typeRequired',
        message: 'labs.requests.error.unableToRequest',
      } as LabError

      const actualError = validateLabRequest(lab)

      expect(actualError).toEqual(expectedError)
    })
  })

  describe('validate completed', () => {
    it('should not return error when result is filled', () => {
      const lab = {
        result: 'some result',
      } as Lab

      const expectedError = {} as LabError

      const actualError = validateLabComplete(lab)

      expect(actualError).toEqual(expectedError)
    })

    it('should return error when result is missing', () => {
      const lab = {} as Lab

      const expectedError = {
        result: 'labs.requests.error.resultRequiredToComplete',
        message: 'labs.requests.error.unableToComplete',
      } as LabError

      const actualError = validateLabComplete(lab)

      expect(actualError).toEqual(expectedError)
    })
  })
})
