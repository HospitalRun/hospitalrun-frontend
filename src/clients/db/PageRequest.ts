export default interface PageRequest {
  /** the page number requested */
  number: number
  /** the size of the pages */
  size: number

  startKey?: string

  previousStartKeys?: string[]
}
