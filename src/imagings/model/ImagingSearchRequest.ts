export type ImagingFilter = 'completed' | 'requested' | 'canceled' | 'all'

export default interface ImagingSearchRequest {
  status: ImagingFilter
  text: string
}
