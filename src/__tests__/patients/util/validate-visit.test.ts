import subDays from 'date-fns/subDays'

import validateVisit from '../../../patients/util/validate-visit'
import Visit from '../../../shared/model/Visit'

describe('validate visit', () => {
  it('should validate required fields', () => {
    const expectedError = {
      endDateTime: 'patient.visits.error.endDateRequired',
      startDateTime: 'patient.visits.error.startDateRequired',
      status: 'patient.visits.error.locationRequired',
    }

    const actualError = validateVisit({} as Visit)

    expect(actualError).toEqual(expectedError)
  })

  it('should validate the start date time is before end date time', () => {
    const givenVisit: Visit = {
      startDateTime: new Date().toISOString(),
      endDateTime: subDays(new Date(), 1).toISOString(),
      id: '123',
      reason: 'reason for visit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'type',
      status: 'planned',
      reason: 'given reason',
      location: 'give location',
    }

    const actualError = validateVisit(givenVisit)

    expect(actualError).toEqual(
      expect.objectContaining({ endDateTime: 'patient.visits.error.endDateMustBeAfterStartDate' }),
    )
  })

  it('should not validate given a valid visit', () => {
    const givenVisit: Visit = {
      startDateTime: new Date().toISOString(),
      endDateTime: subDays(new Date(), -1).toISOString(),
      id: '123',
      reason: 'reason for visit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'type',
      status: 'planned',
      reason: 'given reason',
      location: 'give location',
    }

    const actualError = validateVisit(givenVisit)

    expect(actualError).toEqual({})
  })
})
