import usePatientLabs from '../../../patients/hooks/usePatientLabs'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient labs', () => {
  it('should get patient labs', async () => {
    const expectedPatientId = '123'
    const expectedLabs = ([{ id: expectedPatientId, type: 'lab type' }] as unknown) as Lab[]
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValueOnce(expectedLabs)

    const actualLabs = await executeQuery(() => usePatientLabs(expectedPatientId))

    expect(PatientRepository.getLabs).toHaveBeenCalledTimes(1)
    expect(PatientRepository.getLabs).toHaveBeenCalledWith(expectedPatientId)
    expect(actualLabs).toEqual(expectedLabs)
  })
})
