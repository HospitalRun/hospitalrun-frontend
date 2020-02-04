import AbstractDBModel from './AbstractDBModel'
import Name from './Name'
import ContactInformation from './ContactInformation'
import RelatedPerson from './RelatedPerson'

export default interface Person extends AbstractDBModel, Name, ContactInformation {
  type: string
  friendlyId: string
  sex?: string
  dateOfBirth?: string
  isApproximateDateOfBirth?: boolean
  preferredLanguage?: string
  occupation?: string
  relatedPersons?: RelatedPerson[]
}
