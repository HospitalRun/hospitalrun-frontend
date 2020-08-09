import usePatients from '../../../patients/hooks/usePatients'
import PatientSearchRequest from '../../../patients/models/PatientSearchRequest'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patients', () => {
  it('should search patients with the proper search request', async () => {
    const expectedPatientTotalCount = 1
    const expectedSearchRequest = { queryString: 'someQueryString' } as PatientSearchRequest
    const expectedPatients = [{ id: '123', givenName: 'test' }] as Patient[]
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce(expectedPatients)
    jest.spyOn(PatientRepository, 'count').mockResolvedValueOnce(expectedPatientTotalCount)

    const actualPatients = await executeQuery(() => usePatients(expectedSearchRequest))

    expect(PatientRepository.search).toHaveBeenCalledTimes(1)
    expect(PatientRepository.search).toHaveBeenCalledWith(expectedSearchRequest.queryString)
    expect(actualPatients).toEqual({
      patients: expectedPatients,
      totalCount: expectedPatientTotalCount,
    })
  })
})
