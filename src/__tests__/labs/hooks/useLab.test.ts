import useLab from '../../../labs/hooks/useLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeQuery from '../../test-utils/use-query.util'

describe('Use lab', () => {
  const expectedLabId = 'lab id'
  const expectedLab = {
    id: expectedLabId,
  } as Lab

  it('should get a lab by id', async () => {
    jest.spyOn(LabRepository, 'find').mockResolvedValue(expectedLab)
    const actualData = await executeQuery(() => useLab(expectedLabId))

    expect(LabRepository.find).toHaveBeenCalledTimes(1)
    expect(LabRepository.find).toHaveBeenCalledWith(expectedLabId)
    expect(actualData).toEqual(expectedLab)
  })
})
