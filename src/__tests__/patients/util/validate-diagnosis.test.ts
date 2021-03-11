import validateDiagnosis from '../../../patients/util/validate-diagnosis'

describe('validate diagnosis', () => {
  it('should check for required fields', () => {
    const diagnosis = {} as any
    const expectedError = {
      name: 'patient.diagnoses.error.nameRequired',
      diagnosisDate: 'patient.diagnoses.error.dateRequired',
      onsetDate: 'patient.diagnoses.error.dateRequired',
      abatementDate: 'patient.diagnoses.error.dateRequired',
      status: 'patient.diagnoses.error.statusRequired',
    }

    const actualError = validateDiagnosis(diagnosis)

    expect(actualError).toEqual(expectedError)
  })
})
