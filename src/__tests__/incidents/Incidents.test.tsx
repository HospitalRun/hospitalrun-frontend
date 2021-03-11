import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Incidents from '../../incidents/Incidents'
import * as titleUtil from '../../page-header/title/TitleContext'
import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const expectedIncident = {
  id: '1234',
  code: '1234',
  date: new Date().toISOString(),
  reportedOn: new Date().toISOString(),
  reportedBy: 'some user',
} as Incident

function setup(permissions: Permissions[], path: string) {
  jest.spyOn(IncidentRepository, 'search').mockResolvedValue([])
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

  const store = mockStore({
    user: { permissions },
    breadcrumbs: { breadcrumbs: [] },
    components: { sidebarCollapsed: false },
  } as any)
  const history = createMemoryHistory({ initialEntries: [path] })

  return {
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/incidents/:id">
            <titleUtil.TitleProvider>
              <Incidents />
            </titleUtil.TitleProvider>
          </Route>
        </Router>
      </Provider>,
    ),
  }
}

describe('Incidents', () => {
  describe('routing', () => {
    describe('/incidents/new', () => {
      it('The new incident screen when /incidents/new is accessed', () => {
        setup([Permissions.ReportIncident], '/incidents/new')

        expect(screen.getByRole('form', { name: /report incident form/i })).toBeInTheDocument()
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', async () => {
        const { history } = setup([], '/incidents/new')

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })

    describe('/incidents/visualize', () => {
      it('The incident visualize screen when /incidents/visualize is accessed', async () => {
        const { container } = setup([Permissions.ViewIncidentWidgets], '/incidents/visualize')

        await waitFor(() => {
          expect(container.querySelector('canvas')).toBeInTheDocument()
        })
      })

      it('should not navigate to /incidents/visualize if the user does not have ViewIncidentWidgets permissions', async () => {
        const { history } = setup([], '/incidents/visualize')

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })

    describe('/incidents/:id', () => {
      it('The view incident screen when /incidents/:id is accessed', async () => {
        setup([Permissions.ViewIncident], `/incidents/${expectedIncident.id}`)

        expect(await screen.findByText(expectedIncident.reportedBy)).toBeInTheDocument()
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', async () => {
        const { history } = setup([], `/incidents/${expectedIncident.id}`)

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })
  })
})
