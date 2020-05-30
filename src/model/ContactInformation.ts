import Address from './Address'
import Email from './Email'
import PhoneNumber from './PhoneNumber'

export default interface ContactInformation {
  phoneNumbers: PhoneNumber[]
  emails?: Email[]
  addresses?: Address[]
}
