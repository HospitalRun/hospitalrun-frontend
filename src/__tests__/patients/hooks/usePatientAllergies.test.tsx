import usePatientAllergies from '../../../patients/hooks/usePatientAllergies'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient allergies', () => {
  it('should get patient allergies', async () => {
    const expectedPatientId = '123'
    const expectedAllergies = [{ id: expectedPatientId, name: 'allergy name' }]
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce({
      id: expectedPatientId,
      allergies: expectedAllergies,
    } as Patient)

    const actualAllergies = await executeQuery(() => usePatientAllergies(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualAllergies).toEqual(expectedAllergies)
  })
})
