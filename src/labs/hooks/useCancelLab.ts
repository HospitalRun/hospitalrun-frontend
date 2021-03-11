import { useMutation, queryCache } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'

function cancelLab(lab: Lab): Promise<Lab> {
  lab.canceledOn = new Date(Date.now().valueOf()).toISOString()
  lab.status = 'canceled'
  return LabRepository.saveOrUpdate(lab)
}

export default function useCancelLab() {
  return useMutation(cancelLab, {
    onSuccess: async () => {
      queryCache.invalidateQueries('labs')
    },
  })
}
