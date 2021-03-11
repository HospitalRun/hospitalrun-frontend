import useCarePlan from '../../../patients/hooks/useCarePlan'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use care plan', () => {
  let errorMock: jest.SpyInstance

  beforeEach(() => {
    jest.resetAllMocks()
    errorMock = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    errorMock.mockRestore()
  })

  it('should return a care plan  given a patient id and care plan id', async () => {
    const expectedPatientId = '123'
    const expectedCarePlan = { id: '456', title: 'some title' } as CarePlan
    const expectedPatient = { id: expectedPatientId, carePlans: [expectedCarePlan] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    const actualCarePlan = await executeQuery(() =>
      useCarePlan(expectedPatientId, expectedCarePlan.id),
    )

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualCarePlan).toEqual(expectedCarePlan)
  })

  it('should throw an error if patient does not have care plan with id', async () => {
    const expectedPatientId = '123'
    const expectedCarePlan = { id: '456', title: 'some title' } as CarePlan
    const expectedPatient = {
      id: expectedPatientId,
      carePlans: [{ id: '426', title: 'some title' }],
    } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    try {
      await executeQuery(
        () => useCarePlan(expectedPatientId, expectedCarePlan.id),
        (query) => query.isError,
      )
    } catch (e) {
      expect(e).toEqual(new Error('Care Plan not found'))
    }
  })
})
