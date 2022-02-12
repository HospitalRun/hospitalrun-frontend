import subDays from 'date-fns/subDays'

import useUpdateIncident from '../../../incidents/hooks/useUpdateIncident'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import executeMutation from '../../test-utils/use-mutation.util'

describe('useResolvedIncident', () => {
  it('should mark incident as resolved and save', async () => {
    const expectedResolvedDate = new Date(Date.now())
    Date.now = jest.fn().mockReturnValue(expectedResolvedDate)

    const givenIncident = {
      category: 'some category',
      categoryItem: 'some category item',
      date: subDays(new Date(), 3).toISOString(),
      department: 'some department',
      description: 'some description',
      status: 'resolved',
      code: 'I-some-code',
      reportedOn: subDays(new Date(), 2).toISOString(),
      reportedBy: 'some user',
    } as Incident

    const expectedIncident = {
      ...givenIncident,
      resolvedOn: expectedResolvedDate.toISOString(),
    } as Incident
    jest.spyOn(IncidentRepository, 'save').mockResolvedValue(expectedIncident)

    const actualData = await executeMutation(() => useUpdateIncident(), givenIncident)

    expect(IncidentRepository.save).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.save).toBeCalledWith(expectedIncident)
    expect(actualData).toEqual(expectedIncident)
  })
})
