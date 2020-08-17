import { act, renderHook } from '@testing-library/react-hooks'

import usePatientRelatedPersons from '../../../patients/hooks/usePatientRelatedPersons'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

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

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => usePatientRelatedPersons(expectedPatientId))
      await waitUntilQueryIsSuccessful(renderHookResult)
      const { result } = renderHookResult
      actualData = result.current.data
    })

    expect(PatientRepository.find).toHaveBeenNthCalledWith(1, expectedPatientId)
    expect(PatientRepository.find).toHaveBeenNthCalledWith(2, expectedRelatedPatientId)
    expect(actualData).toEqual([{ ...expectedRelatedPersonPatientDetails, type: 'test' }])
  })
})
