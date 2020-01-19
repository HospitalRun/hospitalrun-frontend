import Name from './Name'
import ContactInformation from './ContactInformation'

export default interface RelatedPerson extends Name, ContactInformation {
  type: string
}
