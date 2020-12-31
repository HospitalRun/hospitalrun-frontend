import useLab from '../../../labs/hooks/useLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeQuery from '../../test-utils/use-query.util'

describe('Use lab', () => {
  const expectedLabId = 'lab id'
  const expectedLab = {
    id: expectedLabId,
  } as Lab

  jest.spyOn(LabRepository, 'find').mockResolvedValue(expectedLab)

  it('should get a lab by id', async () => {
    const actualData = await executeQuery(() => useLab(expectedLabId))

    expect(LabRepository.find).toHaveBeenCalledTimes(1)
    expect(LabRepository.find).toHaveBeenCalledWith(expectedLabId)
    expect(actualData).toEqual(expectedLab)
  })
})
