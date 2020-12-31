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

  const labRepositoryFindAllSpy = jest
    .spyOn(LabRepository, 'findAll')
    .mockResolvedValue(expectedLabs)
  const labRepositorySearchSpy = jest.spyOn(LabRepository, 'search').mockResolvedValue(expectedLabs)

  beforeEach(() => {
    labRepositoryFindAllSpy.mockClear()
  })

  it('should return all labs', async () => {
    const expectedLabsSearchRequest = {
      text: '',
      status: 'all',
    } as LabSearchRequest

    const actualData = await executeQuery(() => useLabsSearch(expectedLabsSearchRequest))

    expect(labRepositoryFindAllSpy).toHaveBeenCalledTimes(1)
    expect(labRepositorySearchSpy).not.toHaveBeenCalled()
    expect(actualData).toEqual(expectedLabs)
  })

  it('should search for labs', async () => {
    const expectedLabsSearchRequest = {
      text: 'search text',
      status: 'all',
    } as LabSearchRequest

    const actualData = await executeQuery(() => useLabsSearch(expectedLabsSearchRequest))

    expect(labRepositoryFindAllSpy).not.toHaveBeenCalled()
    expect(labRepositorySearchSpy).toHaveBeenCalledTimes(1)
    expect(labRepositorySearchSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedLabsSearchRequest),
    )
    expect(actualData).toEqual(expectedLabs)
  })
})
