import { act, renderHook } from '@testing-library/react-hooks'

import useLabsSearch from '../../../labs/hooks/useLabsSearch'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('Use Labs Search', () => {
  const expectedLabs = [
    {
      id: 'lab id',
    },
  ] as Lab[]

  const labRepositoryFindAllSpy = jest
    .spyOn(LabRepository, 'findAll')
    .mockResolvedValue(expectedLabs)
  const labRepositorySearchSpy = jest.spyOn(LabRepository, 'search').mockResolvedValue(expectedLabs)

  beforeEach(() => {
    labRepositoryFindAllSpy.mockClear()
  })

  it('should return all labs', async () => {
    const expectedSearchText = ''
    const expectedStatus = 'all'

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useLabsSearch(expectedSearchText, expectedStatus))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(labRepositoryFindAllSpy).toHaveBeenCalledTimes(1)
    expect(labRepositorySearchSpy).not.toHaveBeenCalled()
    expect(actualData).toEqual(expectedLabs)
  })

  it('should search for labs', async () => {
    const expectedSearchText = 'search text'
    const expectedStatus = 'all'

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useLabsSearch(expectedSearchText, expectedStatus))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(labRepositoryFindAllSpy).not.toHaveBeenCalled()
    expect(labRepositorySearchSpy).toHaveBeenCalledTimes(1)
    expect(labRepositorySearchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ text: expectedSearchText, status: expectedStatus }),
    )
    expect(actualData).toEqual(expectedLabs)
  })
})
