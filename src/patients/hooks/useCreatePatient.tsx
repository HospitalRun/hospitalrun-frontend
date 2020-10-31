import { isEmpty } from 'lodash'
import { useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import { cleanupPatient } from '../util/set-patient-helper'
import validatePatient from '../util/validate-patient'

async function createPatient(patient: Patient): Promise<Patient> {
  const cleanPatient = cleanupPatient(patient)
  const error = validatePatient(cleanPatient)

  if (!isEmpty(error)) {
    throw error
  }

  return PatientRepository.save(cleanPatient)
}

export default function useCreatePatient() {
  return useMutation<Patient, Error, Patient>(createPatient)
}
