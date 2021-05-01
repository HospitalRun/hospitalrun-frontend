import useLabsSearch from '../../../labs/hooks/useLabsSearch'
import LabSearchRequest from '../../../labs/model/LabSearchRequest'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeQuery from '../../test-utils/use-query.util'

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

    const actualData = await executeQuery(() => useLabsSearch(expectedLabsSearchRequest))

    expect(LabRepository.findAll).toHaveBeenCalledTimes(1)
    expect(LabRepository.search).not.toHaveBeenCalled()
    expect(actualData).toEqual(expectedLabs)
  })

  it('should search for labs', async () => {
    const expectedLabsSearchRequest = {
      text: 'search text',
      status: 'all',
    } as LabSearchRequest

    const actualData = await executeQuery(() => useLabsSearch(expectedLabsSearchRequest))

    expect(LabRepository.findAll).not.toHaveBeenCalled()
    expect(LabRepository.search).toHaveBeenCalledTimes(1)
    expect(LabRepository.search).toHaveBeenCalledWith(
      expect.objectContaining(expectedLabsSearchRequest),
    )
    expect(actualData).toEqual(expectedLabs)
  })
})
