export default interface ImagingSearchRequest {
  status: 'completed' | 'requested' | 'canceled' | 'all'
  text: string
}
