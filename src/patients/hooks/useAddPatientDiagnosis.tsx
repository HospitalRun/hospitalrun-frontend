import isEmpty from 'lodash/isEmpty'
import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Diagnosis from '../../shared/model/Diagnosis'
import { uuid } from '../../shared/util/uuid'
import validateDiagnosis from '../util/validate-diagnosis'

interface AddDiagnosisRequest {
  patientId: string
  diagnosis: Omit<Diagnosis, 'id'>
}

async function addDiagnosis(request: AddDiagnosisRequest): Promise<Diagnosis[]> {
  const error = validateDiagnosis(request.diagnosis)
  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const diagnoses = patient.diagnoses ? [...patient.diagnoses] : []
    const newDiagnosis: Diagnosis = {
      id: uuid(),
      ...request.diagnosis,
    }
    diagnoses.push(newDiagnosis)
    await PatientRepository.saveOrUpdate({ ...patient, diagnoses })
    return diagnoses
  }
  throw error
}

export default function useAddPatientDiagnosis() {
  return useMutation(addDiagnosis, {
    onSuccess: async (data, variables) => {
      await queryCache.setQueryData(['diagnoses', variables.patientId], data)
    },
    throwOnError: true,
  })
}
