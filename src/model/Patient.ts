import AbstractDBModel from './AbstractDBModel'
import Name from './Name'
import ContactInformation from './ContactInformation'
import RelatedPerson from './RelatedPerson'
import Allergy from './Allergy'
import Diagnosis from './Diagnosis'
import Note from './Note'

export default interface Patient extends AbstractDBModel, Name, ContactInformation {
  sex: string
  dateOfBirth: string
  isApproximateDateOfBirth: boolean
  preferredLanguage?: string
  occupation?: string
  type?: string
  code: string
  relatedPersons?: RelatedPerson[]
  allergies?: Allergy[]
  diagnoses?: Diagnosis[]
  notes?: Note[]
}
