import subDays from 'date-fns/subDays'

import validateCareGoal from '../../../patients/util/validate-caregoal'
import CareGoal from '../../../shared/model/CareGoal'

describe('validate care goal', () => {
  it('should validate required fields', () => {
    const expectedError = {
      description: 'patient.careGoal.error.descriptionRequired',
      priority: 'patient.careGoal.error.priorityRequired',
      status: 'patient.careGoal.error.statusRequired',
      achievementStatus: 'patient.careGoal.error.achievementStatusRequired',
      startDate: 'patient.careGoal.error.startDate',
      dueDate: 'patient.careGoal.error.dueDate',
    }

    const actualError = validateCareGoal({} as CareGoal)

    expect(actualError).toEqual(expectedError)
  })

  it('should validate the start date time is before end date time', () => {
    const givenCareGoal = {
      startDate: new Date().toISOString(),
      dueDate: subDays(new Date(), 1).toISOString(),
    } as CareGoal

    const actualError = validateCareGoal(givenCareGoal)

    expect(actualError).toEqual(
      expect.objectContaining({ dueDate: 'patient.careGoal.error.dueDateMustBeAfterStartDate' }),
    )
  })
})
