import { isEmpty } from 'lodash'
import { useMutation, queryCache } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import { validateLabComplete } from '../utils/validate-lab'

function completeLab(lab: Lab): Promise<Lab> {
  const completeLabErrors = validateLabComplete(lab)

  if (isEmpty(completeLabErrors)) {
    const completedLab: Lab = {
      ...lab,
      completedOn: new Date(Date.now().valueOf()).toISOString(),
      status: 'completed',
    }

    return LabRepository.saveOrUpdate(completedLab)
  }

  throw completeLabErrors
}

export default function useCompleteLab() {
  return useMutation(completeLab, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('labs')
      await queryCache.invalidateQueries('lab')
    },
    throwOnError: true,
  })
}
