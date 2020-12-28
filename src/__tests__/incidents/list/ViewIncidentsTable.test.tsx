import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router'

import IncidentFilter from '../../../incidents/IncidentFilter'
import ViewIncidentsTable, { populateExportData } from '../../../incidents/list/ViewIncidentsTable'
import IncidentSearchRequest from '../../../incidents/model/IncidentSearchRequest'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import { extractUsername } from '../../../shared/util/extractUsername'

describe('View Incidents Table', () => {
  const setup = (expectedSearchRequest: IncidentSearchRequest, expectedIncidents: Incident[]) => {
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)
    const history = createMemoryHistory()

    return {
      history,
      ...render(
        <Router history={history}>
          <ViewIncidentsTable searchRequest={expectedSearchRequest} />
        </Router>,
      ),
    }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call the incidents search with the search request', async () => {
    const expectedSearchRequest: IncidentSearchRequest = { status: IncidentFilter.all }

    setup(expectedSearchRequest, [])

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
    const { container } = setup({ status: IncidentFilter.all }, expectedIncidents)

    await waitFor(() => {
      expect(container.querySelector('table')).toBeTruthy()
    })
    expect(screen.getByText(expectedIncidents[0].code)).toBeInTheDocument()
    expect(
      screen.getByText(format(new Date(expectedIncidents[0].date), 'yyyy-MM-dd hh:mm a')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(format(new Date(expectedIncidents[0].reportedOn), 'yyyy-MM-dd hh:mm a')),
    ).toBeInTheDocument()
    expect(screen.getByText(extractUsername(expectedIncidents[0].reportedBy))).toBeInTheDocument()
    expect(screen.getByText(expectedIncidents[0].status)).toBeInTheDocument()

    expect(screen.getByText(/incidents.reports.code/i)).toBeInTheDocument()
    expect(screen.getByText(/incidents.reports.dateOfIncident/i)).toBeInTheDocument()
    expect(screen.getByText(/incidents.reports.reportedBy/i)).toBeInTheDocument()
    expect(screen.getByText(/incidents.reports.reportedOn/i)).toBeInTheDocument()
    expect(screen.getByText(/incidents.reports.status/i)).toBeInTheDocument()
    expect(screen.getByText(/actions.label/i)).toBeInTheDocument()
  })

  it('should display a download button', async () => {
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
    setup({ status: IncidentFilter.all }, expectedIncidents)

    expect(
      await screen.findByRole('button', { name: /incidents.reports.download/i }),
    ).toBeInTheDocument()
  })

  it('should populate export data correctly', async () => {
    const data = [
      {
        category: 'asdf',
        categoryItem: 'asdf',
        code: 'I-eClU6OdkR',
        createdAt: '2020-09-06T04:02:38.011Z',
        date: '2020-09-06T04:02:32.855Z',
        department: 'asdf',
        description: 'asdf',
        id: 'af9f968f-61d9-47c3-9321-5da3f381c38b',
        reportedBy: 'some user',
        reportedOn: '2020-09-06T04:02:38.011Z',
        rev: '1-91d1ba60588b779c9554c7e20e15419c',
        status: 'reported',
        updatedAt: '2020-09-06T04:02:38.011Z',
      },
    ]

    const expectedExportData = [
      {
        code: 'I-eClU6OdkR',
        date: format(new Date(data[0].date), 'yyyy-MM-dd hh:mm a'),
        reportedBy: 'some user',
        reportedOn: format(new Date(data[0].reportedOn), 'yyyy-MM-dd hh:mm a'),
        status: 'reported',
      },
    ]

    const exportData = [{}]
    populateExportData(exportData, data)

    expect(exportData).toEqual(expectedExportData)
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
    const { container, history } = await setup({ status: IncidentFilter.all }, expectedIncidents)
    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
    userEvent.click(screen.getByRole('button', { name: /actions.view/i }))
    expect(history.location.pathname).toEqual(`/incidents/${expectedIncidents[0].id}`)
  })
})
