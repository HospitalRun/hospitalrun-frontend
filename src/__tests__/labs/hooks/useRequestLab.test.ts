import useRequestLab from '../../../labs/hooks/useRequestLab'
import * as validateLabRequest from '../../../labs/utils/validate-lab'
import { LabError } from '../../../labs/utils/validate-lab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Request lab', () => {
  const expectedRequestedOnDate = new Date()
  const lab = {
    type: 'test',
    patient: '123',
  } as Lab
  const expectedRequestedLab = {
    ...lab,
    requestedOn: expectedRequestedOnDate.toISOString(),
  } as Lab

  Date.now = jest.fn(() => expectedRequestedOnDate.valueOf())

  beforeEach(() => {
    jest.spyOn(LabRepository, 'save').mockResolvedValue(expectedRequestedLab)
  })

  it('should save new request lab', async () => {
    const actualData = await executeMutation(() => useRequestLab(), lab)

    expect(LabRepository.save).toHaveBeenCalledTimes(1)
    expect(LabRepository.save).toHaveBeenCalledWith(lab)
    expect(actualData).toEqual(expectedRequestedLab)
  })

  it('should return errors', async () => {
    expect.hasAssertions()

    const expectedError = {
      message: 'error message',
      patient: 'error patient',
      type: 'error type',
    } as LabError

    expectOneConsoleError(expectedError)
    jest.spyOn(validateLabRequest, 'validateLabRequest').mockReturnValue(expectedError)

    try {
      await executeMutation(() => useRequestLab(), lab)
    } catch (e) {
      expect(e).toEqual(expectedError)
      expect(LabRepository.save).not.toHaveBeenCalled()
    }
  })
})
