import Sort from 'clients/Sort'

export default interface SortRequest {
  sorts: Sort[]
}

export const Unsorted: SortRequest = { sorts: [] }
