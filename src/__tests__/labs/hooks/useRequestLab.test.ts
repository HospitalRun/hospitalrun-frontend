import { act } from '@testing-library/react-hooks'

import useRequestLab from '../../../labs/hooks/useRequestLab'
import * as validateLabRequest from '../../../labs/utils/validate-lab'
import { LabError } from '../../../labs/utils/validate-lab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
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
  jest.spyOn(LabRepository, 'save').mockResolvedValue(expectedRequestedLab)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should save new request lab', async () => {
    let actualData: any
    await act(async () => {
      actualData = await executeMutation(() => useRequestLab(), lab)
    })

    expect(LabRepository.save).toHaveBeenCalledTimes(1)
    expect(LabRepository.save).toHaveBeenCalledWith(lab)
    expect(actualData).toEqual(expectedRequestedLab)
  })

  it('should return errors', async () => {
<<<<<<< HEAD
    const labError = {
=======
<<<<<<< HEAD
    const labError = {
=======
    expect.hasAssertions()

    const expectedError = {
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
      message: 'error message',
      patient: 'error patient',
      type: 'error type',
    } as LabError

<<<<<<< HEAD
    jest.spyOn(validateLabRequest, 'validateLabRequest').mockReturnValue(labError)
=======
<<<<<<< HEAD
    jest.spyOn(validateLabRequest, 'validateLabRequest').mockReturnValue(labError)
=======
    jest.spyOn(validateLabRequest, 'validateLabRequest').mockReturnValue(expectedError)
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux

    await act(async () => {
      try {
        await executeMutation(() => useRequestLab(), lab)
      } catch (e) {
<<<<<<< HEAD
        expect(e).toEqual(labError)
=======
<<<<<<< HEAD
        expect(e).toEqual(labError)
=======
        expect(e).toEqual(expectedError)
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux
>>>>>>> 9a7d1db6... refactor(labs): use react query instead of redux
        expect(LabRepository.save).not.toHaveBeenCalled()
      }
    })
  })
})
