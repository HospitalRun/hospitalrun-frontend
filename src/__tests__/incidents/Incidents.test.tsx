import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Incidents from '../../incidents/Incidents'
import * as titleUtil from '../../page-header/title/TitleContext'
import IncidentRepository from '../../shared/db/IncidentRepository'
import Incident from '../../shared/model/Incident'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Incidents', () => {
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

    // eslint-disable-next-line react/prop-types
    const Wrapper: React.FC = ({ children }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
        </MemoryRouter>
      </Provider>
    )

    return render(<Incidents />, { wrapper: Wrapper })
  }

  describe('routing', () => {
    describe('/incidents/new', () => {
      it('The new incident screen when /incidents/new is accessed', () => {
        setup([Permissions.ReportIncident], '/incidents/new')
        expect(screen.getAllByText(/incidents.reports/i)[0]).toBeInTheDocument()
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', () => {
        setup([], '/incidents/new')
        expect(screen.queryByText(/incidents.reports/i)).not.toBeInTheDocument()
      })
    })

    describe('/incidents/visualize', () => {
      it('The incident visualize screen when /incidents/visualize is accessed', async () => {
        const { container } = setup([Permissions.ViewIncidentWidgets], '/incidents/visualize')
        await waitFor(() => {
          expect(container.querySelector('.chartjs-render-monitor')).toBeInTheDocument()
        })
      })

      it('should not navigate to /incidents/visualize if the user does not have ViewIncidentWidgets permissions', () => {
        const { container } = setup([], '/incidents/visualize')
        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })

    describe('/incidents/:id', () => {
      it('The view incident screen when /incidents/:id is accessed', async () => {
        setup([Permissions.ViewIncident], `/incidents/${expectedIncident.id}`)
        expect(await screen.findByText(expectedIncident.reportedBy)).toBeInTheDocument()
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', async () => {
        const { container } = setup([], `/incidents/${expectedIncident.id}`)
        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })
  })
})
