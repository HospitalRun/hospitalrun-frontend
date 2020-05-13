import AbstractDBModel from 'model/AbstractDBModel'
import Allergy from 'model/Allergy'
import ContactInformation from 'model/ContactInformation'
import Diagnosis from 'model/Diagnosis'
import Name from 'model/Name'
import Note from 'model/Note'
import RelatedPerson from 'model/RelatedPerson'

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
