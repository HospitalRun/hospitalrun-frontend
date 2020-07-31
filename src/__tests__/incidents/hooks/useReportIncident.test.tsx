import { act, renderHook } from '@testing-library/react-hooks'
import { subDays } from 'date-fns'
import shortid from 'shortid'

import useReportIncident from '../../../incidents/hooks/useReportIncident'
import * as incidentValidator from '../../../incidents/util/validate-incident'
import { IncidentError } from '../../../incidents/util/validate-incident'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'

describe('useReportIncident', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should save the incident with correct data', async () => {
    const expectedCode = '123456'
    const expectedDate = new Date(Date.now())
    const expectedStatus = 'reported'
    const expectedReportedBy = 'some user'
    Date.now = jest.fn().mockReturnValue(expectedDate)

    const givenIncidentRequest = {
      category: 'some category',
      categoryItem: 'some category item',
      date: subDays(new Date(), 3).toISOString(),
      department: 'some department',
      description: 'some description',
    } as Incident

    const expectedIncident = {
      ...givenIncidentRequest,
      code: `I-${expectedCode}`,
      reportedOn: expectedDate.toISOString(),
      status: expectedStatus,
      reportedBy: expectedReportedBy,
    } as Incident
    jest.spyOn(shortid, 'generate').mockReturnValue(expectedCode)
    jest.spyOn(IncidentRepository, 'save').mockResolvedValue(expectedIncident)

    let mutateToTest: any
    await act(async () => {
      const renderHookResult = renderHook(() => useReportIncident())
      const { result, waitForNextUpdate } = renderHookResult
      await waitForNextUpdate()
      const [mutate] = result.current
      mutateToTest = mutate
    })

    let actualData: any
    await act(async () => {
      const result = await mutateToTest(givenIncidentRequest)
      actualData = result
    })

    expect(IncidentRepository.save).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.save).toBeCalledWith(expectedIncident)
    expect(actualData).toEqual(expectedIncident)
  })

  it('should throw an error if validation fails', async () => {
    const expectedIncidentError = {
      description: 'some description error',
    } as IncidentError

    jest.spyOn(incidentValidator, 'default').mockReturnValue(expectedIncidentError)
    jest.spyOn(IncidentRepository, 'save').mockResolvedValue({} as Incident)

    let mutateToTest: any
    await act(async () => {
      const renderHookResult = renderHook(() => useReportIncident())
      const { result, waitForNextUpdate } = renderHookResult
      await waitForNextUpdate()
      const [mutate] = result.current
      mutateToTest = mutate
    })

    try {
      await act(async () => {
        await mutateToTest({} as Incident)
      })
    } catch (e) {
      expect(e).toEqual(expectedIncidentError)
      expect(IncidentRepository.save).not.toHaveBeenCalled()
    }
  })
})
