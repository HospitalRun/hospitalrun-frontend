import { isEmpty } from 'lodash'
import { queryCache, useMutation } from 'react-query'

import PatientRepository from '../../shared/db/PatientRepository'
import Allergy from '../../shared/model/Allergy'
import { uuid } from '../../shared/util/uuid'
import validateAllergy from '../util/validate-allergy'

interface AddAllergyRequest {
  patientId: string
  allergy: Allergy
}

async function addAllergy(request: AddAllergyRequest): Promise<Allergy> {
  const error = validateAllergy(request.allergy)

  if (isEmpty(error)) {
    const patient = await PatientRepository.find(request.patientId)
    const allergies = patient.allergies ? [...patient.allergies] : []
    const newAllergy = {
      id: uuid(),
      ...request.allergy,
    }
    allergies.push(newAllergy)

    await PatientRepository.saveOrUpdate({
      ...patient,
      allergies,
    })

    return newAllergy
  }

  throw error
}

export default function useAddAllergy() {
  return useMutation(addAllergy, {
    onSuccess: async (_, variables) => {
      await queryCache.invalidateQueries(['allergies', variables.patientId])
    },
    throwOnError: true,
  })
}
