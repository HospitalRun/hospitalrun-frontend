import { act, renderHook } from '@testing-library/react-hooks'

import useLab from '../../../labs/hooks/useLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('Use lab', () => {
  const expectedLabId = 'lab id'
  const expectedLab = {
    id: expectedLabId,
  } as Lab

  jest.spyOn(LabRepository, 'find').mockResolvedValue(expectedLab)

  it('should get a lab by id', async () => {
    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useLab(expectedLabId))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(LabRepository.find).toHaveBeenCalledTimes(1)
    expect(LabRepository.find).toHaveBeenCalledWith(expectedLabId)
    expect(actualData).toEqual(expectedLab)
  })
})
