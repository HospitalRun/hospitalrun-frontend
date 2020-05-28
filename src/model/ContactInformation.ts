import Address from './Address'
import Email from './Email'
import PhoneNumber from './PhoneNumber'

export default interface ContactInformation {
  phoneNumber: PhoneNumber[]
  email?: Email[]
  address?: Address[]
}
