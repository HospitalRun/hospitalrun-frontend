import RelatedPerson from './RelatedPerson'
import Person from './Person'

export default interface Patient extends Person {
  friendlyId: string
  relatedPersons?: RelatedPerson[]
}
