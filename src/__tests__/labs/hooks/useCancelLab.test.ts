import { act } from '@testing-library/react-hooks'

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

  Date.now = jest.fn(() => expectedCanceledOnDate.valueOf())
  jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedCanceledLab)

  it('should cancel a lab', async () => {
    let actualData: any
    await act(async () => {
      actualData = await executeMutation(() => useCancelLab(), lab)
    })

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(lab)
    expect(actualData).toEqual(expectedCanceledLab)
  })
})
