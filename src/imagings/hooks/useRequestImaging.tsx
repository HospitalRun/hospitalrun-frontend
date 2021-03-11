import isEmpty from 'lodash/isEmpty'
import { queryCache, useMutation } from 'react-query'

import ImagingRepository from '../../shared/db/ImagingRepository'
import Imaging from '../../shared/model/Imaging'
import validateImagingRequest from '../util/validate-imaging-request'

export interface ImagingRequest {
  status: 'completed' | 'requested' | 'canceled'
  patient: string
  visitId: string
  fullName: string
  notes?: string
  type: string
}

function requestImagingWrapper(user: any) {
  return async function requestImaging(request: ImagingRequest): Promise<void> {
    const error = validateImagingRequest(request)

    if (!isEmpty(error)) {
      throw error
    }

    await ImagingRepository.save({
      ...request,
      requestedBy: user?.id || '',
      requestedByFullName: user?.fullName || '',
      requestedOn: new Date(Date.now()).toISOString(),
    } as Imaging)
  }
}

export default function useRequestImaging(user: any) {
  return useMutation(requestImagingWrapper(user), {
    onSuccess: async () => {
      await queryCache.invalidateQueries('imagings')
    },
    throwOnError: true,
  })
}
