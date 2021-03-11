import RelatedPerson from '../../shared/model/RelatedPerson'

export class RelatedPersonError extends Error {
  relatedPersonError?: string

  relationshipTypeError?: string

  constructor(message: string, related: string, relationship: string) {
    super(message)
    this.relatedPersonError = related
    this.relationshipTypeError = relationship
    Object.setPrototypeOf(this, RelatedPersonError.prototype)
  }
}

export default function validateRelatedPerson(relatedPerson: Partial<RelatedPerson>) {
  const error: any = {}

  if (!relatedPerson.patientId) {
    error.relatedPersonError = 'patient.relatedPersons.error.relatedPersonRequired'
  }

  if (!relatedPerson.type) {
    error.relationshipTypeError = 'patient.relatedPersons.error.relationshipTypeRequired'
  }

  return error
}
