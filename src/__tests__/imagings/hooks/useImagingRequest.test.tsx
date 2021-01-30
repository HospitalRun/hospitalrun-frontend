import useImagingRequest from '../../../imagings/hooks/useImagingRequest'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import Imaging from '../../../shared/model/Imaging'
import executeQuery from '../../test-utils/use-query.util'

describe('useImagingRequest', () => {
  it('should get an imaging request by id', async () => {
    const expectedImagingId = 'some id'
    const expectedImagingRequest = {
      id: expectedImagingId,
      patient: 'some patient',
      visitId: 'visit id',
      status: 'requested',
      type: 'some type',
    } as Imaging
    jest.spyOn(ImagingRepository, 'find').mockResolvedValue(expectedImagingRequest)

    const actualData = await executeQuery(() => useImagingRequest(expectedImagingId))

    expect(ImagingRepository.find).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.find).toBeCalledWith(expectedImagingId)
    expect(actualData).toEqual(expectedImagingRequest)
  })
})
