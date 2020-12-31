import { act, renderHook } from '@testing-library/react-hooks'

import useLabsSearch from '../../../labs/hooks/useLabsSearch'
import LabSearchRequest from '../../../labs/model/LabSearchRequest'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('Use Labs Search', () => {
  const expectedLabs = [
    {
      id: 'lab id',
    },
  ] as Lab[]

  beforeEach(() => {
    jest.spyOn(LabRepository, 'findAll').mockResolvedValue(expectedLabs)
    jest.spyOn(LabRepository, 'search').mockResolvedValue(expectedLabs)
  })

  it('should return all labs', async () => {
    const expectedLabsSearchRequest = {
      text: '',
      status: 'all',
    } as LabSearchRequest

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useLabsSearch(expectedLabsSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(LabRepository.findAll).toHaveBeenCalledTimes(1)
    expect(LabRepository.search).not.toHaveBeenCalled()
    expect(actualData).toEqual(expectedLabs)
  })

  it('should search for labs', async () => {
    const expectedLabsSearchRequest = {
      text: 'search text',
      status: 'all',
    } as LabSearchRequest

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useLabsSearch(expectedLabsSearchRequest))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(LabRepository.findAll).not.toHaveBeenCalled()
    expect(LabRepository.search).toHaveBeenCalledTimes(1)
    expect(LabRepository.search).toHaveBeenCalledWith(
      expect.objectContaining(expectedLabsSearchRequest),
    )
    expect(actualData).toEqual(expectedLabs)
  })
})
