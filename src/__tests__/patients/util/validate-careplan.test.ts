import subDays from 'date-fns/subDays'

import validateCarePlan from '../../../patients/util/validate-careplan'
import CarePlan from '../../../shared/model/CarePlan'

describe('validate care plan', () => {
  it('should validate required fields', () => {
    const expectedError = {
      title: 'patient.carePlan.error.titleRequired',
      description: 'patient.carePlan.error.descriptionRequired',
      status: 'patient.carePlan.error.statusRequired',
      intent: 'patient.carePlan.error.intentRequired',
      startDate: 'patient.carePlan.error.startDateRequired',
      endDate: 'patient.carePlan.error.endDateRequired',
      condition: 'patient.carePlan.error.conditionRequired',
    }

    const actualError = validateCarePlan({} as CarePlan)

    expect(actualError).toEqual(expectedError)
  })

  it('should validate the start date time is before end date time', () => {
    const givenCarePlan = {
      startDate: new Date().toISOString(),
      endDate: subDays(new Date(), 1).toISOString(),
    } as CarePlan

    const actualError = validateCarePlan(givenCarePlan)

    expect(actualError).toEqual(
      expect.objectContaining({ endDate: 'patient.carePlan.error.endDateMustBeAfterStartDate' }),
    )
  })
})
