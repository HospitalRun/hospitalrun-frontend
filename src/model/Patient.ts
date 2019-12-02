import AbstractDBModel from './AbstractDBModel'

export default class Patient extends AbstractDBModel {
  firstName: string

  lastName: string

  constructor(id: string, rev: string, firstName: string, lastName: string) {
    super(id, rev)
    this.firstName = firstName
    this.lastName = lastName
  }
}
