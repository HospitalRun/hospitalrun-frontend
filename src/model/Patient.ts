import AbstractDBModel from './AbstractDBModel'
import { getPatientName } from '../util/patient-name-util'

export default class Patient extends AbstractDBModel {
  prefix?: string

  givenName?: string

  familyName?: string

  fullName: string

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

  friendlyId: string

  constructor(
    id: string,
    friendlyId: string,
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
    this.fullName = getPatientName(this.givenName, this.familyName, this.suffix)
    this.friendlyId = friendlyId
  }
}
