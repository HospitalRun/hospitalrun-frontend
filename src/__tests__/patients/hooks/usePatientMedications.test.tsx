import usePatientMedications from '../../../patients/hooks/usePatientMedications'
import PatientRepository from '../../../shared/db/PatientRepository'
import Medication from '../../../shared/model/Medication'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient medications', () => {
  it('should get patient medications', async () => {
    const expectedPatientId = '123'
    const expectedMedications = ([
      { id: expectedPatientId, type: 'medication type' },
    ] as unknown) as Medication[]
    jest.spyOn(PatientRepository, 'getMedications').mockResolvedValueOnce(expectedMedications)

    const actualMedications = await executeQuery(() => usePatientMedications(expectedPatientId))

    expect(PatientRepository.getMedications).toHaveBeenCalledTimes(1)
    expect(PatientRepository.getMedications).toHaveBeenCalledWith(expectedPatientId)
    expect(actualMedications).toEqual(expectedMedications)
  })
})
