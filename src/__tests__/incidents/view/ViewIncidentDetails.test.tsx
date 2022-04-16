import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router'

import ViewIncidentDetails from '../../../incidents/view/ViewIncidentDetails'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'

describe('View Incident Details', () => {
  const expectedDate = new Date(2020, 5, 1, 19, 48)
  const reportedDate = new Date(2020, 5, 1, 19, 50)
  const expectedResolveDate = new Date()
  const expectedIncidentId = '1234'
  const expectedIncident = {
    id: expectedIncidentId,
    code: 'some code',
    department: 'some department',
    description: 'some description',
    category: 'some category',
    categoryItem: 'some categoryItem',
    status: 'reported',
    reportedBy: 'some user id',
    reportedOn: reportedDate.toISOString(),
    date: expectedDate.toISOString(),
  } as Incident

  const setup = (mockIncident: Incident) => {
    Date.now = jest.fn(() => expectedResolveDate.valueOf())
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(mockIncident)
    jest.spyOn(IncidentRepository, 'saveOrUpdate').mockResolvedValue(expectedIncident)

    const history = createMemoryHistory()
    history.push(`/incidents/1234`)

    const renderResults = render(
      <ButtonBarProvider.ButtonBarProvider>
        <Router history={history}>
          <ViewIncidentDetails incident={mockIncident} isLoading={false} />
        </Router>
      </ButtonBarProvider.ButtonBarProvider>,
    )

    return { ...renderResults, history }
  }

  describe('view incident details', () => {
    describe('view incident details header', () => {
      it('should render the date of the incident', async () => {
        setup(expectedIncident)
        expect(
          await screen.findByRole('heading', {
            name: /incidents\.reports\.dateofincident/i,
          }),
        ).toBeInTheDocument()

        expect(
          await screen.findByRole('heading', { name: /2020-06-01 07:48 PM/i }),
        ).toBeInTheDocument()
      })

      it('should render the status of the incident', async () => {
        setup(expectedIncident)

        expect(
          await screen.findByRole('heading', {
            name: /incidents\.reports\.status/i,
          }),
        ).toBeInTheDocument()

        expect(await screen.findByRole('heading', { name: 'reported' })).toBeInTheDocument()
      })

      it('should render who reported the incident', async () => {
        setup(expectedIncident)

        expect(
          await screen.findByRole('heading', {
            name: /incidents\.reports\.reportedby/i,
          }),
        ).toBeInTheDocument()

        expect(await screen.findByRole('heading', { name: 'some user id' }))
      })
      it('should render the date the incident was reported', async () => {
        setup(expectedIncident)

        expect(
          await screen.findByRole('heading', {
            name: /incidents\.reports\.reportedon/i,
          }),
        ).toBeInTheDocument()

        expect(
          await screen.findByRole('heading', { name: /2020-06-01 07:50 PM/i }),
        ).toBeInTheDocument()
      })
    })
    describe('form elements should not be editable', () => {
      it('should render the department input with label and display value', async () => {
        setup(expectedIncident)
        expect(await screen.findByText(/incidents\.reports\.department/i)).toBeInTheDocument()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.department/i }),
        ).not.toBeEnabled()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.department/i }),
        ).toHaveDisplayValue('some department')
      })

      it('should render the category input with label and display value', async () => {
        setup(expectedIncident)
        expect(await screen.findByText(/incidents\.reports\.category$/i)).toBeInTheDocument()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.category$/i }),
        ).not.toBeEnabled()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.category$/i }),
        ).toHaveDisplayValue('some category')
      })
      it('should render the categoryItem input with label and display value', async () => {
        setup(expectedIncident)
        expect(await screen.findByText(/incidents\.reports\.categoryItem$/i)).toBeInTheDocument()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.categoryItem$/i }),
        ).not.toBeEnabled()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.categoryItem$/i }),
        ).toHaveDisplayValue('some categoryItem')
      })

      it('should render the description input with label and display value', async () => {
        setup(expectedIncident)
        expect(
          await screen.findByRole('textbox', {
            name: /incidents\.reports\.description/i,
          }),
        ).toBeInTheDocument()
        expect(
          screen.getByRole('textbox', {
            name: /incidents\.reports\.description/i,
          }),
        ).not.toBeEnabled()

        expect(
          await screen.findByRole('textbox', { name: /incidents\.reports\.description/i }),
        ).toHaveDisplayValue('some description')
      })
    })
  })
})
