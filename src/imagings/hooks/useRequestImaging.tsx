import { isEmpty } from 'lodash'
import { queryCache, useMutation } from 'react-query'

import ImagingRepository from '../../shared/db/ImagingRepository'
import AbstractDBModel from '../../shared/model/AbstractDBModel'
import Imaging from '../../shared/model/Imaging'
import validateImagingRequest from '../util/validate-imaging-request'

type ImagingRequest = Omit<Imaging, 'id' & keyof AbstractDBModel>

async function requestImaging(request: ImagingRequest): Promise<void> {
  const error = validateImagingRequest(request)

  if (!isEmpty(error)) {
    throw error
  }

  await ImagingRepository.save({
    ...request,
    requestedBy: 'test',
    requestedOn: new Date(Date.now()).toISOString(),
  } as Imaging)
}

export default function useRequestImaging() {
  return useMutation(requestImaging, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('imagings')
    },
    throwOnError: true,
  })
}
