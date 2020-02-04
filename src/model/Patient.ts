import Person from './Person'

export default interface Patient extends Person {
  friendlyId: string
  firstVisit?: boolean
}
