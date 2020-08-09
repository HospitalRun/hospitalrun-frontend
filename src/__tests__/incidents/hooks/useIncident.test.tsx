import { renderHook, act } from '@testing-library/react-hooks'

import useIncident from '../../../incidents/hooks/useIncident'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('useIncident', () => {
  it('should get an incident by id', async () => {
    const expectedIncidentId = 'some id'
    const expectedIncident = {
      id: expectedIncidentId,
    } as Incident
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useIncident(expectedIncidentId))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.find).toBeCalledWith(expectedIncidentId)
    expect(actualData).toEqual(expectedIncident)
  })
})
