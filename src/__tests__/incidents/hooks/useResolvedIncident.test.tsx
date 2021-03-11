import subDays from 'date-fns/subDays'

import useResolveIncident from '../../../incidents/hooks/useResolveIncident'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import executeMutation from '../../test-utils/use-mutation.util'

describe('useResolvedIncident', () => {
  it('should mark incident as resolved and save', async () => {
    const expectedStatus = 'resolved'
    const expectedResolvedDate = new Date(Date.now())
    Date.now = jest.fn().mockReturnValue(expectedResolvedDate)

    const givenIncident = {
      category: 'some category',
      categoryItem: 'some category item',
      date: subDays(new Date(), 3).toISOString(),
      department: 'some department',
      description: 'some description',
      status: 'reported',
      code: 'I-some-code',
      reportedOn: subDays(new Date(), 2).toISOString(),
      reportedBy: 'some user',
    } as Incident

    const expectedIncident = {
      ...givenIncident,
      resolvedOn: expectedResolvedDate.toISOString(),
      status: expectedStatus,
    } as Incident
    jest.spyOn(IncidentRepository, 'save').mockResolvedValue(expectedIncident)

    const actualData = await executeMutation(() => useResolveIncident(), givenIncident)

    expect(IncidentRepository.save).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.save).toBeCalledWith(expectedIncident)
    expect(actualData).toEqual(expectedIncident)
  })
})
