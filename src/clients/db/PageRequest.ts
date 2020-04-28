export default interface PageRequest {
  limit: number | undefined
  skip: number
}
export const UnpagedRequest: PageRequest = { limit: undefined, skip: 0 }
