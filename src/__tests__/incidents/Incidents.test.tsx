import { render, waitFor } from '@testing-library/react'
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
  function setup(permissions: Permissions[], path: string) {
    const expectedIncident = {
      id: '1234',
      code: '1234',
      date: new Date().toISOString(),
      reportedOn: new Date().toISOString(),
    } as Incident
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
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

  describe('title', () => {
    it('should have called the useUpdateTitle hook', () => {
      setup([Permissions.ViewIncidents], '/incidents')
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })
  })

  describe('routing', () => {
    describe('/incidents/new', () => {
      it('The new incident screen when /incidents/new is accessed', () => {
        const { container } = setup([Permissions.ReportIncident], '/incidents/new')

        expect(container).toHaveTextContent('incidents.reports')
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', () => {
        const { container } = setup([], '/incidents/new')

        expect(container).not.toHaveTextContent('incidents.reports')
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

        expect(container.querySelector('.chartjs-render-monitor')).not.toBeInTheDocument()
      })
    })

    describe('/incidents/:id', () => {
      it('The view incident screen when /incidents/:id is accessed', () => {
        const { container } = setup([Permissions.ViewIncident], '/incidents/1234')
        expect(container.querySelectorAll('div').length).toBe(3)
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', () => {
        const { container } = setup([], '/incidents/1234')
        expect(container.querySelectorAll('div').length).not.toBe(3)
      })
    })
  })
})
