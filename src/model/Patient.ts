import AbstractDBModel from './AbstractDBModel'
import Name from './Name'

export default class Patient extends AbstractDBModel {
  name: Name

  sex: string

  dateOfBirth?: string

  isApproximateDateOfBirth?: boolean

  phoneNumber?: string

  email?: string

  address?: string

  preferredLanguage?: string

  occupation?: string

  type?: string

  constructor(
    id: string,
    rev: string,
    name: Name,
    sex: string,
    dateOfBirth?: string,
    isApproximateDateOfBirth?: boolean,
    phoneNumber?: string,
    email?: string,
    address?: string,
    preferredLanguage?: string,
    occupation?: string,
    type?: string,
  ) {
    super(id, rev)
    this.name = name
    this.sex = sex
    this.dateOfBirth = dateOfBirth
    this.isApproximateDateOfBirth = isApproximateDateOfBirth
    this.phoneNumber = phoneNumber
    this.email = email
    this.address = address
    this.preferredLanguage = preferredLanguage
    this.occupation = occupation
    this.type = type
  }
}
