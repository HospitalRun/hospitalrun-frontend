import useIncidents from '../../../incidents/hooks/useIncidents'
import IncidentFilter from '../../../incidents/IncidentFilter'
import IncidentSearchRequest from '../../../incidents/model/IncidentSearchRequest'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import executeQuery from '../../test-utils/use-query.util'

describe('useIncidents', () => {
  it('it should search incidents', async () => {
    const expectedSearchRequest: IncidentSearchRequest = {
      status: IncidentFilter.all,
    }
    const expectedIncidents = [
      {
        id: 'some id',
      },
    ] as Incident[]
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

    const actualData = await executeQuery(() => useIncidents(expectedSearchRequest))

    expect(IncidentRepository.search).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.search).toBeCalledWith(expectedSearchRequest)
    expect(actualData).toEqual(expectedIncidents)
  })
})
