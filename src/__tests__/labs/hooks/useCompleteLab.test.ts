import useCompleteLab from '../../../labs/hooks/useCompleteLab'
import { LabError } from '../../../labs/utils/validate-lab'
import * as validateLabUtils from '../../../labs/utils/validate-lab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Complete lab', () => {
  const expectedCompletedOnDate = new Date()
  const lab = {
    type: 'test',
    result: 'some result',
  } as Lab
  const expectedCompletedLab = {
    ...lab,
    completedOn: expectedCompletedOnDate.toISOString(),
    status: 'completed',
  } as Lab

  Date.now = jest.fn(() => expectedCompletedOnDate.valueOf())

  beforeEach(() => {
    jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedCompletedLab)
  })

  it('should save lab as complete', async () => {
    const actualData = await executeMutation(() => useCompleteLab(), lab)

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(expectedCompletedLab)
    expect(actualData).toEqual(expectedCompletedLab)
  })

  it('should throw errors', async () => {
    expect.hasAssertions()

    const expectedLabError = {
      result: 'some result error message',
    } as LabError

    expectOneConsoleError(expectedLabError)
    jest.spyOn(validateLabUtils, 'validateLabComplete').mockReturnValue(expectedLabError)

    try {
      await executeMutation(() => useCompleteLab(), lab)
    } catch (e) {
      expect(e).toEqual(expectedLabError)
      expect(LabRepository.saveOrUpdate).not.toHaveBeenCalled()
    }
  })
})
