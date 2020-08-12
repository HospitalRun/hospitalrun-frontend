import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router'

import IncidentFilter from '../../../incidents/IncidentFilter'
import ViewIncidentsTable from '../../../incidents/list/ViewIncidentsTable'
import IncidentSearchRequest from '../../../incidents/model/IncidentSearchRequest'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'

describe('View Incidents Table', () => {
  const setup = async (
    expectedSearchRequest: IncidentSearchRequest,
    expectedIncidents: Incident[],
  ) => {
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

    let wrapper: any
    const history = createMemoryHistory()
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <ViewIncidentsTable searchRequest={expectedSearchRequest} />
        </Router>,
      )
    })
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, history }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call the incidents search with the search request', async () => {
    const expectedSearchRequest: IncidentSearchRequest = {
      status: IncidentFilter.all,
    }
    await setup(expectedSearchRequest, [])

    expect(IncidentRepository.search).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.search).toHaveBeenCalledWith(expectedSearchRequest)
  })

  it('should display a table of incidents', async () => {
    const expectedIncidents: Incident[] = [
      {
        id: 'incidentId1',
        code: 'someCode',
        date: new Date(2020, 7, 4, 0, 0, 0, 0).toISOString(),
        reportedOn: new Date(2020, 8, 4, 0, 0, 0, 0).toISOString(),
        reportedBy: 'com.test:user',
        status: 'reported',
      } as Incident,
    ]
    const { wrapper } = await setup({ status: IncidentFilter.all }, expectedIncidents)

    const incidentsTable = wrapper.find(Table)

    expect(incidentsTable.exists()).toBeTruthy()
    expect(incidentsTable.prop('data')).toEqual(expectedIncidents)
    expect(incidentsTable.prop('columns')).toEqual([
      expect.objectContaining({ label: 'incidents.reports.code', key: 'code' }),
      expect.objectContaining({ label: 'incidents.reports.dateOfIncident', key: 'date' }),
      expect.objectContaining({ label: 'incidents.reports.reportedBy', key: 'reportedBy' }),
      expect.objectContaining({ label: 'incidents.reports.reportedOn', key: 'reportedOn' }),
      expect.objectContaining({ label: 'incidents.reports.status', key: 'status' }),
    ])
    expect(incidentsTable.prop('actionsHeaderText')).toEqual('actions.label')
  })

  it('should format the data correctly', async () => {
    const expectedIncidents: Incident[] = [
      {
        id: 'incidentId1',
        code: 'someCode',
        date: new Date(2020, 7, 4, 12, 0, 0, 0).toISOString(),
        reportedOn: new Date(2020, 8, 4, 12, 0, 0, 0).toISOString(),
        reportedBy: 'com.test:user',
        status: 'reported',
      } as Incident,
    ]
    const { wrapper } = await setup({ status: IncidentFilter.all }, expectedIncidents)

    const incidentsTable = wrapper.find(Table)
    const dateFormatter = incidentsTable.prop('columns')[1].formatter as any
    const reportedByFormatter = incidentsTable.prop('columns')[2].formatter as any
    const reportedOnFormatter = incidentsTable.prop('columns')[3].formatter as any

    expect(dateFormatter(expectedIncidents[0])).toEqual('2020-08-04 12:00 PM')
    expect(reportedOnFormatter(expectedIncidents[0])).toEqual('2020-09-04 12:00 PM')
    expect(reportedByFormatter(expectedIncidents[0])).toEqual('user')
  })

  it('should navigate to the view incident screen when view button is clicked', async () => {
    const expectedIncidents: Incident[] = [
      {
        id: 'incidentId1',
        code: 'someCode',
        date: new Date(2020, 7, 4, 12, 0, 0, 0).toISOString(),
        reportedOn: new Date(2020, 8, 4, 12, 0, 0, 0).toISOString(),
        reportedBy: 'com.test:user',
        status: 'reported',
      } as Incident,
    ]
    const { wrapper, history } = await setup({ status: IncidentFilter.all }, expectedIncidents)

    act(() => {
      const table = wrapper.find(Table) as any
      const onViewClick = table.prop('actions')[0].action as any
      onViewClick(expectedIncidents[0])
    })

    expect(history.location.pathname).toEqual(`/incidents/${expectedIncidents[0].id}`)
  })
})
