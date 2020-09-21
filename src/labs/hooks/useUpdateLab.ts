import { useMutation, queryCache } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'

function updateLab(labToUpdate: Lab): Promise<Lab> {
  return LabRepository.saveOrUpdate(labToUpdate)
}

export default function useUpdateLab() {
  return useMutation(updateLab, {
    onSuccess: async (data) => {
      queryCache.setQueryData(['lab', data.id], data)
      await queryCache.invalidateQueries('labs')
    },
  })
}
