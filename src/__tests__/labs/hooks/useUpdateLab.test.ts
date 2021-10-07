import useUpdateLab from '../../../labs/hooks/useUpdateLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use update lab', () => {
  const expectedLab = {
    type: 'some type',
    notes: [
      {
        id: 'test-note-id',
        date: new Date().toISOString(),
        text: 'Hi, this is an example test note',
        deleted: false,
      },
    ],
  } as Lab

  it('should update lab', async () => {
    jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedLab)
    const actualData = await executeMutation(() => useUpdateLab(), expectedLab)

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(expectedLab)
    expect(actualData).toEqual(expectedLab)
  })
})
