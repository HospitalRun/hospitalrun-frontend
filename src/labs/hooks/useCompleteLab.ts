import isEmpty from 'lodash/isEmpty'
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
    onSuccess: async (data) => {
      queryCache.setQueryData(['lab', data.id], data)
      await queryCache.invalidateQueries('labs')
    },
    throwOnError: true,
  })
}
