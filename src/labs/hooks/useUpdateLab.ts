import { useMutation, queryCache } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'

function updateLab(labToUpdate: Lab): Promise<Lab> {
  return LabRepository.saveOrUpdate(labToUpdate)
}

export default function useUpdateLab() {
  return useMutation(updateLab, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('labs')
      await queryCache.invalidateQueries('lab')
    },
  })
}
