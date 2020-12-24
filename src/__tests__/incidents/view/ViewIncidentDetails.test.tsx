import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router'

import ViewIncidentDetails from '../../../incidents/view/ViewIncidentDetails'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'

describe('View Incident Details', () => {
  const expectedDate = new Date(2020, 5, 1, 19, 48)
  const expectedResolveDate = new Date()
  let incidentRepositorySaveSpy: any
  const expectedIncidentId = '1234'
  const expectedIncident = {
    id: expectedIncidentId,
    code: 'some code',
    department: 'some department',
    description: 'some description',
    category: 'some category',
    categoryItem: 'some category item',
    status: 'reported',
    reportedBy: 'some user id',
    reportedOn: expectedDate.toISOString(),
    date: expectedDate.toISOString(),
  } as Incident

  const setup = (mockIncident: Incident, permissions: Permissions[]) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedResolveDate.valueOf())
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(mockIncident)
    incidentRepositorySaveSpy = jest
      .spyOn(IncidentRepository, 'saveOrUpdate')
      .mockResolvedValue(expectedIncident)

    const history = createMemoryHistory()
    history.push(`/incidents/1234`)

    const renderResults = render(
      <ButtonBarProvider.ButtonBarProvider>
        <Router history={history}>
          <ViewIncidentDetails incidentId="1234" permissions={permissions} />
        </Router>
      </ButtonBarProvider.ButtonBarProvider>,
    )

    return { ...renderResults, history }
  }
  test('type into department field', async () => {
    setup(expectedIncident, [Permissions.ViewIncident, Permissions.ResolveIncident])
    expect(
      await screen.findByRole('textbox', { name: /incidents\.reports\.department/i }),
    ).toBeInTheDocument()
  })

  test('type into category field', async () => {
    setup(expectedIncident, [Permissions.ViewIncident, Permissions.ResolveIncident])
    expect(
      screen.getByRole('textbox', {
        name: /incidents\.reports\.category\b/i,
      }),
    ).toBeInTheDocument()
  })

  test('type into category item field', () => {
    setup(expectedIncident, [Permissions.ViewIncident, Permissions.ResolveIncident])
    expect(
      screen.getByRole('textbox', {
        name: /incidents\.reports\.categoryitem/i,
      }),
    ).toBeInTheDocument()
  })

  test('type into description field', () => {
    setup(expectedIncident, [Permissions.ViewIncident, Permissions.ResolveIncident])
    expect(
      screen.getByRole('textbox', {
        name: /incidents\.reports\.description/i,
      }),
    ).toBeInTheDocument()
  })

  describe('on resolve', () => {
    it('should mark the status as resolved and fill in the resolved date with the current time', async () => {
      const { history } = await setup(expectedIncident, [
        Permissions.ViewIncident,
        Permissions.ResolveIncident,
      ])

      const resolveButton = screen.getByRole('button', {
        name: /incidents\.reports\.resolve/i,
      })

      userEvent.click(resolveButton)

      await waitFor(() => expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1))
      expect(history.location.pathname).toEqual('/incidents')
    })
  })
})
