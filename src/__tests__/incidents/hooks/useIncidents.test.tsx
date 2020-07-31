import { act, renderHook } from '@testing-library/react-hooks'

import useIncidents from '../../../incidents/hooks/useIncidents'
import IncidentFilter from '../../../incidents/IncidentFilter'
import IncidentSearchRequest from '../../../incidents/model/IncidentSearchRequest'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import waitUntilQueryIsSuccessful from '../../wait-for-query-test-util'

describe('useIncidents', () => {
  it('it should search incidents', async () => {
    const expectedSearchRequest: IncidentSearchRequest = {
      status: IncidentFilter.all,
    }
    const expectedIncidents = [
      {
        id: 'some id',
      },
    ] as Incident[]
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useIncidents(expectedSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(IncidentRepository.search).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.search).toBeCalledWith(expectedSearchRequest)
    expect(actualData).toEqual(expectedIncidents)
  })
})
