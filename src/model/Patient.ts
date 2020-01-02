import AbstractDBModel from './AbstractDBModel'

export default class Patient extends AbstractDBModel {
  prefix?: string

  givenName?: string

  familyName?: string

  suffix?: string

  sex: string

  dateOfBirth: string

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
    sex: string,
    dateOfBirth: string,
    prefix?: string,
    givenName?: string,
    familyName?: string,
    suffix?: string,
    isApproximateDateOfBirth?: boolean,
    phoneNumber?: string,
    email?: string,
    address?: string,
    preferredLanguage?: string,
    occupation?: string,
    type?: string,
  ) {
    super(id, rev)
    this.prefix = prefix
    this.givenName = givenName
    this.familyName = familyName
    this.suffix = suffix
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
