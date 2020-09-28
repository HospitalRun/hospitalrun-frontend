import { act } from '@testing-library/react-hooks'

import useUpdateLab from '../../../labs/hooks/useUpdateLab'
import LabRepository from '../../../shared/db/LabRepository'
import Lab from '../../../shared/model/Lab'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use update lab', () => {
  const expectedLab = {
    type: 'some type',
    notes: ['some note'],
  } as Lab

  jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(expectedLab)

  it('should update lab', async () => {
    let actualData: any

    await act(async () => {
      actualData = await executeMutation(() => useUpdateLab(), expectedLab)
    })

    expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(expectedLab)
    expect(actualData).toEqual(expectedLab)
  })
})
