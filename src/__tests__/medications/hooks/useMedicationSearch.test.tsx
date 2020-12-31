import useMedicationSearch from '../../../medications/hooks/useMedicationSearch'
import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Medication from '../../../shared/model/Medication'
import executeQuery from '../../test-utils/use-query.util'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

describe('useMedicationSearch', () => {
  it('it should search medication requests', async () => {
    const expectedSearchRequest: MedicationSearchRequest = {
      status: 'all',
      text: 'some search request',
    }
    const expectedMedicationRequests = [{ id: 'some id' }] as Medication[]
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue(expectedMedicationRequests)

    const actualData = await executeQuery(() => useMedicationSearch(expectedSearchRequest))

    expect(MedicationRepository.search).toHaveBeenCalledTimes(1)
    expect(MedicationRepository.search).toBeCalledWith({
      ...expectedSearchRequest,
      defaultSortRequest,
    })
    expect(actualData).toEqual(expectedMedicationRequests)
  })
})
