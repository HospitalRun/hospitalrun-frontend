import useAddCareGoal from '../../../patients/hooks/useAddCareGoal'
import { CareGoalError } from '../../../patients/util/validate-caregoal'
import * as validateCareGoal from '../../../patients/util/validate-caregoal'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add care goal', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should add a care goal to the patient', async () => {
    const expectedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedDate)

    const expectedCareGoal: CareGoal = {
      id: '123',
      description: 'some description',
      priority: 'medium',
      status: CareGoalStatus.Accepted,
      achievementStatus: CareGoalAchievementStatus.Improving,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      note: 'some note',
      createdOn: expectedDate.toISOString(),
    }

    const givenPatient = {
      id: '123',
      givenName: 'given name',
      fullName: 'full name',
      careGoals: [] as CareGoal[],
    } as Patient

    const expectedPatient = {
      ...givenPatient,
      careGoals: [expectedCareGoal],
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedCareGoal.id)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)

    const result = await executeMutation(() => useAddCareGoal(), {
      patientId: givenPatient.id,
      careGoal: expectedCareGoal,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual([expectedCareGoal])
  })

  it('should throw an error if validation fails', async () => {
    const expectedError = {
      message: 'patient.careGoal.error.unableToAdd',
      description: 'some error',
    } as CareGoalError
    expectOneConsoleError(expectedError)
    jest.spyOn(validateCareGoal, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddCareGoal(), { patientId: '123', careGoal: {} as CareGoal })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })
})
