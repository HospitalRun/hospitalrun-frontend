import { render, screen } from '@testing-library/react'
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
  const expectedIncident = {
    id: 'incidentId1',
    code: 'someCode',
    date: new Date(2020, 7, 4, 0, 0, 0, 0).toISOString(),
    reportedOn: new Date(2020, 8, 4, 0, 0, 0, 0).toISOString(),
    reportedBy: 'com.test:user',
    status: 'reported',
  } as Incident

  const setup = (
    expectedSearchRequest: IncidentSearchRequest,
    expectedIncidents = [expectedIncident],
  ) => {
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

  it('should display a table of incidents', async () => {
    setup({ status: IncidentFilter.all })
    expect(await screen.findByRole('table')).toBeInTheDocument()

    const headers = screen.getAllByRole('columnheader')
    const cells = screen.getAllByRole('cell')
    expect(headers[0]).toHaveTextContent(/incidents.reports.code/i)
    expect(headers[1]).toHaveTextContent(/incidents.reports.dateOfIncident/i)
    expect(headers[2]).toHaveTextContent(/incidents.reports.reportedBy/i)
    expect(headers[3]).toHaveTextContent(/incidents.reports.reportedOn/i)
    expect(headers[4]).toHaveTextContent(/incidents.reports.status/i)
    expect(headers[5]).toHaveTextContent(/actions.label/i)
    expect(cells[0]).toHaveTextContent(expectedIncident.code)
    expect(cells[1]).toHaveTextContent(
      format(new Date(expectedIncident.date), 'yyyy-MM-dd hh:mm a'),
    )
    expect(cells[2]).toHaveTextContent(extractUsername(expectedIncident.reportedBy))
    expect(cells[3]).toHaveTextContent(
      format(new Date(expectedIncident.reportedOn), 'yyyy-MM-dd hh:mm a'),
    )
    expect(cells[4]).toHaveTextContent(expectedIncident.status)
    expect(screen.getByRole('button', { name: /actions.view/i })).toBeInTheDocument()
  })

  it('should display a download button', async () => {
    setup({ status: IncidentFilter.all })
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
    const { history } = setup({ status: IncidentFilter.all })
    expect(await screen.findByRole('table')).toBeInTheDocument()
    userEvent.click(screen.getByRole('button', { name: /actions.view/i }))
    expect(history.location.pathname).toEqual(`/incidents/${expectedIncident.id}`)
  })
})
