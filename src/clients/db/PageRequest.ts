export default interface PageRequest {
  number: number | undefined
  size: number | undefined
  nextPageInfo: { [key: string]: string | null } | undefined
  previousPageInfo: { [key: string]: string | null } | undefined
  direction?: 'previous' | 'next'
}

export const UnpagedRequest: PageRequest = {
  number: undefined,
  size: undefined,
  nextPageInfo: undefined,
  previousPageInfo: undefined,
}
