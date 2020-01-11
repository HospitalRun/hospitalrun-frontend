import AbstractDBModel from './AbstractDBModel'

export default interface Patient extends AbstractDBModel {
  prefix?: string
  givenName?: string
  familyName?: string
  suffix?: string
  fullName?: string
  sex: string
  dateOfBirth: string
  isApproximateDateOfBirth: boolean
  phoneNumber: string
  email?: string
  address?: string
  preferredLanguage?: string
  occupation?: string
  type?: string
  friendlyId: string
}
