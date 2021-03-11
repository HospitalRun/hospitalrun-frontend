import usePatientCarePlans from '../../../patients/hooks/usePatientCarePlans'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient care plans', () => {
  it('should get patient patient care plans', async () => {
    const expectedPatientId = '123'
    const expectedCarePlans: CarePlan[] = [
      {
        id: expectedPatientId,
        intent: CarePlanIntent.Option,
        description: 'some description',
        diagnosisId: 'someDiagnosisId',
        status: CarePlanStatus.Active,
        title: 'some care plan title',
        note: 'some care plan note',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        createdOn: new Date().toISOString(),
      },
    ]
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce({
      id: expectedPatientId,
      carePlans: expectedCarePlans,
    } as Patient)

    const actualAllergies = await executeQuery(() => usePatientCarePlans(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualAllergies).toEqual(expectedCarePlans)
  })
})
