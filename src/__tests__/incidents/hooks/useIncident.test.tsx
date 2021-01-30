import useIncident from '../../../incidents/hooks/useIncident'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import executeQuery from '../../test-utils/use-query.util'

describe('useIncident', () => {
  it('should get an incident by id', async () => {
    const expectedIncidentId = 'some id'
    const expectedIncident = {
      id: expectedIncidentId,
    } as Incident
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

    const actualData = await executeQuery(() => useIncident(expectedIncidentId))

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.find).toBeCalledWith(expectedIncidentId)
    expect(actualData).toEqual(expectedIncident)
  })
})
