import usePatient from '../../../patients/hooks/usePatient'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient', () => {
  it('should return the patient', async () => {
    const expectedPatientId = '123'
    const expectedPatient = { id: expectedPatientId, givenName: 'test' } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    const actualPatient = await executeQuery(() => usePatient(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualPatient).toEqual(expectedPatient)
  })
})
