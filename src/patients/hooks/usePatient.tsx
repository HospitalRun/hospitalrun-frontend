import { useQuery } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'

function fetchPatient(_: any, id?: string): Promise<Patient> {
  return PatientRepository.find(id || '')
}

export default function usePatient(id?: string) {
  return useQuery(['patient', id], fetchPatient, { enabled: id })
}
