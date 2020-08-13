import validateAllergy from '../../../patients/util/validate-allergy'

describe('validate allergy', () => {
  it('should check for required fields', () => {
    const allergy = {} as any
    const expectedError = { nameError: 'patient.allergies.error.nameRequired' }

    const actualError = validateAllergy(allergy)

    expect(actualError).toEqual(expectedError)
  })
})
