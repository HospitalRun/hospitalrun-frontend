import isEmpty from 'lodash/isEmpty'
import { useMutation, queryCache } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import { validateLabRequest } from '../utils/validate-lab'

function requestLab(newLab: Lab): Promise<Lab> {
  const requestLabErrors = validateLabRequest(newLab)

  if (isEmpty(requestLabErrors)) {
    newLab.requestedOn = new Date(Date.now().valueOf()).toISOString()
    return LabRepository.save(newLab)
  }

  throw requestLabErrors
}

export default function useRequestLab() {
  return useMutation(requestLab, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('labs')
    },
    throwOnError: true,
  })
}
