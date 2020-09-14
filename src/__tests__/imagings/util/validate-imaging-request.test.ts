import validateImagingRequest from '../../../imagings/util/validate-imaging-request'
import Imaging from '../../../shared/model/Imaging'

describe('imaging request validator', () => {
  it('should validate the required fields apart of an incident', async () => {
    const newImagingRequest = {} as Imaging
    const expectedError = {
      patient: 'imagings.requests.error.patientRequired',
      status: 'imagings.requests.error.statusRequired',
      type: 'imagings.requests.error.typeRequired',
    }

    const actualError = validateImagingRequest(newImagingRequest)

    expect(actualError).toEqual(expectedError)
  })
})
