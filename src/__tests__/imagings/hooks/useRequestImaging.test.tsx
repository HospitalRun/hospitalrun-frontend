/* eslint-disable no-console */

import useRequestImaging from '../../../imagings/hooks/useRequestImaging'
import { ImagingRequestError } from '../../../imagings/util/validate-imaging-request'
import * as imagingRequestValidator from '../../../imagings/util/validate-imaging-request'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import Imaging from '../../../shared/model/Imaging'
import { UserState, LoginError } from '../../../user/user-slice'
import executeMutation from '../../test-utils/use-mutation.util'

describe('useReportIncident', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    console.error = jest.fn()
  })

  const user = {
    fullName: 'test',
    id: 'test-hospitalrun',
    permissions: [],
    loginError: {} as LoginError,
  } as UserState

  it('should save the imaging request with correct data', async () => {
    const expectedDate = new Date(Date.now())
    Date.now = jest.fn().mockReturnValue(expectedDate)
    const givenImagingRequest = {
      patient: 'some patient',
      fullName: 'some full name',
      status: 'requested',
      type: 'some type',
      notes: 'some notes',
      visitId: 'some visit id',
    } as Imaging

    const expectedImagingRequest = {
      ...givenImagingRequest,
      requestedOn: expectedDate.toISOString(),
      requestedBy: 'test-hospitalrun',
      requestedByFullName: 'test',
    } as Imaging
    jest.spyOn(ImagingRepository, 'save').mockResolvedValue(expectedImagingRequest)

    await executeMutation(() => useRequestImaging(user), givenImagingRequest)
    expect(ImagingRepository.save).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.save).toBeCalledWith(expectedImagingRequest)
  })

  it('should throw an error if validation fails', async () => {
    const expectedImagingRequestError = {
      patient: 'some patient error',
    } as ImagingRequestError

    jest.spyOn(imagingRequestValidator, 'default').mockReturnValue(expectedImagingRequestError)
    jest.spyOn(ImagingRepository, 'save').mockResolvedValue({} as Imaging)

    try {
      await executeMutation(() => useRequestImaging(user), {})
    } catch (e) {
      expect(e).toEqual(expectedImagingRequestError)
      expect(ImagingRepository.save).not.toHaveBeenCalled()
    }
  })
})
