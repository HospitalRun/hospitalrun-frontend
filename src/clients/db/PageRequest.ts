export default interface PageRequest {
  number: number | undefined
  size: number | undefined
}
export const UnpagedRequest: PageRequest = {
  number: undefined,
  size: undefined,
}
