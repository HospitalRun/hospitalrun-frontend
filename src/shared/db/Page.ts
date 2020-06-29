import AbstractDBModel from '../model/AbstractDBModel'
import PageRequest from './PageRequest'

export default interface Page<T extends AbstractDBModel> {
  content: T[]
  hasNext: boolean
  hasPrevious: boolean
  pageRequest?: PageRequest
}
