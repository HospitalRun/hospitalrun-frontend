import { act, renderHook } from '@testing-library/react-hooks'

import useMedicationSearch from '../../../medications/hooks/useMedicationSearch'
import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Medication from '../../../shared/model/Medication'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

describe('useMedicationSearch', () => {
  it('it should search medication requests', async () => {
    const expectedSearchRequest: MedicationSearchRequest = {
      status: 'all',
      text: 'some search request',
    }
    const expectedMedicationRequests = [{ id: 'some id' }] as Medication[]
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue(expectedMedicationRequests)

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useMedicationSearch(expectedSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(MedicationRepository.search).toHaveBeenCalledTimes(1)
    expect(MedicationRepository.search).toBeCalledWith({
      ...expectedSearchRequest,
      defaultSortRequest,
    })
    expect(actualData).toEqual(expectedMedicationRequests)
  })
})
