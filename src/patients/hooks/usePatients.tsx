import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import PatientSearchRequest from '../models/PatientSearchRequest'

interface PatientsResult {
  totalCount: number
  patients: Patient[]
}

async function fetchPatients(_: any, searchRequest: PatientSearchRequest): Promise<PatientsResult> {
  const patients = await PatientRepository.search(searchRequest.queryString)
  const totalCount = await PatientRepository.count()
  return { totalCount, patients }
}

export default function usePatients(searchRequest: PatientSearchRequest) {
  return useQuery(['patients', searchRequest], fetchPatients)
}
