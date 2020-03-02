import AbstractDBModel from './AbstractDBModel'
import Name from './Name'
import ContactInformation from './ContactInformation'
import RelatedPerson from './RelatedPerson'
import Allergy from './Allergy'
import Diagnosis from './Diagnosis'

export default interface Patient extends AbstractDBModel, Name, ContactInformation {
  sex: string
  dateOfBirth: string
  isApproximateDateOfBirth: boolean
  preferredLanguage?: string
  occupation?: string
  type?: string
  friendlyId: string
  relatedPersons?: RelatedPerson[]
  allergies?: Allergy[]
  diagnoses?: Diagnosis[]
}
