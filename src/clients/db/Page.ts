export default class Page<T> {
  /** the content for this page */
  content: T[]

  /** the total number of elements that match the search */
  totalElements: number

  /** the size of the current page */
  size: number

  /** the current page number */
  number: number

  getNextPage?: () => Promise<Page<T>>

  getPreviousPage?: () => Promise<Page<T>>

  constructor(content: T[], totalElements: number, size: number, number: number) {
    this.content = content
    this.totalElements = totalElements
    this.size = size
    this.number = number
  }

  getContent(): T[] {
    return this.content
  }

  getTotalElements(): number {
    return this.totalElements
  }

  getSize(): number {
    return this.size
  }

  getNumber(): number {
    return this.number
  }

  hasNext(): boolean {
    return this.getNextPage !== undefined
  }

  hasPrevious(): boolean {
    return this.getPreviousPage !== undefined
  }
}
