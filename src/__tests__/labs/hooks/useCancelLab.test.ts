import useCancelLab from '../../../labs/hooks/useCancelLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use Cancel Lab', () => {
  const expectedCanceledOnDate = new Date()
  const lab = {
    id: 'id lab',
    status: 'requested',
  } as Lab
  const expectedCanceledLab = {
    ...lab,
    status: 'canceled',
    canceledOn: expectedCanceledOnDate.toISOString(),
  } as Lab

  it('should cancel a lab', async () => {
    Date.now = jest.fn(() => expectedCanceledOnDate.valueOf())
    jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedCanceledLab)
    const actualData = await executeMutation(() => useCancelLab(), lab)

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(lab)
    expect(actualData).toEqual(expectedCanceledLab)
  })
})
