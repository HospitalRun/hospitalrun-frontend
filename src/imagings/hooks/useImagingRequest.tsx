import { QueryKey, useQuery } from 'react-query'

import ImagingRepository from '../../shared/db/ImagingRepository'
import Imaging from '../../shared/model/Imaging'

function getImagingRequestById(_: QueryKey<string>, imagingRequestId: string): Promise<Imaging> {
  return ImagingRepository.find(imagingRequestId)
}

export default function useImagingRequest(imagingRequestId: string) {
  return useQuery(['imaging', imagingRequestId], getImagingRequestById)
}
