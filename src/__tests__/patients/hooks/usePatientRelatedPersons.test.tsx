import usePatientRelatedPersons from '../../../patients/hooks/usePatientRelatedPersons'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient related persons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get the patient by id', async () => {
    const expectedPatientId = 'currentPatientId'
    const expectedRelatedPatientId = 'patientId'
    const expectedRelatedPersonPatientDetails = {
      id: expectedRelatedPatientId,
      givenName: 'test',
    } as Patient
    jest
      .spyOn(PatientRepository, 'find')
      .mockResolvedValueOnce({
        id: expectedPatientId,
        relatedPersons: [
          { id: 'relatedPersonId', patientId: expectedRelatedPatientId, type: 'test' },
        ],
      } as Patient)
      .mockResolvedValueOnce(expectedRelatedPersonPatientDetails)

    const actualData = await executeQuery(() => usePatientRelatedPersons(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenNthCalledWith(1, expectedPatientId)
    expect(PatientRepository.find).toHaveBeenNthCalledWith(2, expectedRelatedPatientId)
    expect(actualData).toEqual([{ ...expectedRelatedPersonPatientDetails, type: 'test' }])
  })
})
