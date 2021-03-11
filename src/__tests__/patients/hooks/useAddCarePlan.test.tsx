import useAddCarePlan from '../../../patients/hooks/useAddCarePlan'
import * as validateCarePlan from '../../../patients/util/validate-careplan'
import { CarePlanError } from '../../../patients/util/validate-careplan'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add care plan', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should add a care plan to the patient', async () => {
    const expectedCreatedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedCreatedDate)
    const expectedCarePlan: CarePlan = {
      id: 'some id',
      description: 'some description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      title: 'some title',
      intent: CarePlanIntent.Option,
      status: CarePlanStatus.Active,
      createdOn: expectedCreatedDate.toISOString(),
      diagnosisId: 'someDiagnosis',
      note: 'some note',
    }
    const givenPatient = { id: 'patientId', carePlans: [] as CarePlan[] } as Patient
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedCarePlan.id)
    const expectedPatient = { ...givenPatient, carePlans: [expectedCarePlan] }
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddCarePlan(), {
      patientId: givenPatient.id,
      carePlan: expectedCarePlan,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual([expectedCarePlan])
  })

  it('should throw an error if validation fails', async () => {
    const expectedError = {
      message: 'patient.carePlan.error.unableToAdd',
      title: 'some error',
    } as CarePlanError
    expectOneConsoleError(expectedError)
    jest.spyOn(validateCarePlan, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddCarePlan(), { patientId: '123', carePlan: {} as CarePlan })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })
})
