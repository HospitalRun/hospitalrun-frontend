export default interface ImagingSearchRequest {
  status: 'completed' | 'requested' | 'canceled'
  text: string
}
