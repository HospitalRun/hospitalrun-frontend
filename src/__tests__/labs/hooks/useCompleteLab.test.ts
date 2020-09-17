import { act } from '@testing-library/react-hooks'

import useCompleteLab from '../../../labs/hooks/useCompleteLab'
<<<<<<< HEAD
import * as validateLabUtils from '../../../labs/utils/validate-lab'
import { LabError } from '../../../labs/utils/validate-lab'
=======
<<<<<<< HEAD
import * as validateLabUtils from '../../../labs/utils/validate-lab'
import { LabError } from '../../../labs/utils/validate-lab'
=======
import { LabError } from '../../../labs/utils/validate-lab'
import * as validateLabUtils from '../../../labs/utils/validate-lab'
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
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
  jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedCompletedLab)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should save lab as complete', async () => {
    let actualData: any
    await act(async () => {
      actualData = await executeMutation(() => useCompleteLab(), lab)
    })

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(expectedCompletedLab)
    expect(actualData).toEqual(expectedCompletedLab)
  })

  it('should throw errors', async () => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    expect.hasAssertions()

>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
    const expectedLabError = {
      result: 'some result error message',
    } as LabError

    jest.spyOn(validateLabUtils, 'validateLabComplete').mockReturnValue(expectedLabError)

    await act(async () => {
      try {
        await executeMutation(() => useCompleteLab(), lab)
      } catch (e) {
        expect(e).toEqual(expectedLabError)
        expect(LabRepository.saveOrUpdate).not.toHaveBeenCalled()
      }
    })
  })
})
