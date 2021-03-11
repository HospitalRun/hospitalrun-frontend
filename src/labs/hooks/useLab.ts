import { useQuery } from 'react-query'

import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'

function fetchLab(_: any, labId: string): Promise<Lab> {
  return LabRepository.find(labId)
}

export default function useLab(labId: string) {
  return useQuery(['lab', labId], fetchLab)
}
