import Person from './Person'

export default interface RelatedPerson extends Person {
  relatedPersonId: string
  relationType: string
}
