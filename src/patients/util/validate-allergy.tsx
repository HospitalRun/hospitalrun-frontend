import Allergy from '../../shared/model/Allergy'

export class AllergyError extends Error {
  nameError?: string

  constructor(message: string, name: string) {
    super(message)
    this.nameError = name
    Object.setPrototypeOf(this, AllergyError.prototype)
  }
}

export default function validateAllergy(allergy: Partial<Allergy>) {
  const error: any = {}
  if (!allergy.name) {
    error.nameError = 'patient.allergies.error.nameRequired'
  }

  return error
}
