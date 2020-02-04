import Person from './Person'

export default interface RelatedPerson extends Person {
  relatedPatientId: string
  relationType: string
}
