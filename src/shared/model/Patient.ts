import AbstractDBModel from './AbstractDBModel'
import Allergy from './Allergy'
import CareGoal from './CareGoal'
import CarePlan from './CarePlan'
import ContactInformation from './ContactInformation'
import Diagnosis from './Diagnosis'
import Name from './Name'
import Note from './Note'
import RelatedPerson from './RelatedPerson'
import Visit from './Visit'

export default interface Patient extends AbstractDBModel, Name, ContactInformation {
  sex: string
  streetAddress: string
  streetAddress2: string
  zip: string
  city: string
  country: string
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
  index: string
  carePlans: CarePlan[]
  careGoals: CareGoal[]
  bloodType: string
  visits: Visit[]
}
