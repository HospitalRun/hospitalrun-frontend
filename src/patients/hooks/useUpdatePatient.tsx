import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import { cleanupPatient } from '../util/set-patient-helper'
import validatePatient, { PatientValidationError } from '../util/validate-patient'

async function updatePatient(patient: Patient): Promise<Patient> {
  const cleanPatient = cleanupPatient(patient)
  const updateError = validatePatient(cleanPatient, {
    errorMessage: 'patient.errors.updatePatientError',
  })

  if (updateError) {
    throw updateError
  }

  return PatientRepository.saveOrUpdate(cleanPatient)
}

export default function useUpdatePatient() {
  return useMutation<Patient, PatientValidationError, Patient>(updatePatient, {
    onSuccess: (patient) => {
      queryCache.setQueryData(['patient', patient.id], patient)
    },
  })
}
