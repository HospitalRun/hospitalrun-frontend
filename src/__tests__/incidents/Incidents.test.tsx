import { render as rtlRender } from '@testing-library/react'
import React from 'react'
import type { ReactElement, ReactNode } from 'react'
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

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

describe('Incidents', () => {
  function render(permissions: Permissions[], path: string) {
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

    function Wrapper({ children }: WrapperProps): ReactElement {
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
          </MemoryRouter>
        </Provider>
      )
    }

    const results = rtlRender(<Incidents />, { wrapper: Wrapper })

    return results
  }

  describe('title', () => {
    it('should have called the useUpdateTitle hook', () => {
      render([Permissions.ViewIncidents], '/incidents')
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })
  })

  describe('routing', () => {
    describe('/incidents/new', () => {
      it('should render the new incident screen when /incidents/new is accessed', () => {
        const { container } = render([Permissions.ReportIncident], '/incidents/new')

        expect(container).toHaveTextContent('incidents.reports')
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', () => {
        const { container } = render([], '/incidents/new')

        expect(container).not.toHaveTextContent('incidents.reports')
      })
    })

    describe('/incidents/visualize', () => {
      it('should render the incident visualize screen when /incidents/visualize is accessed', () => {
        const { container } = render([Permissions.ViewIncidentWidgets], '/incidents/visualize')

        expect(container.querySelector('.chartjs-render-monitor')).toBeInTheDocument()
      })

      it('should not navigate to /incidents/visualize if the user does not have ViewIncidentWidgets permissions', () => {
        const { container } = render([], '/incidents/visualize')

        expect(container.querySelector('.chartjs-render-monitor')).not.toBeInTheDocument()
      })
    })

    describe('/incidents/:id', () => {
      it('should render the view incident screen when /incidents/:id is accessed', () => {
        const { container } = render([Permissions.ViewIncident], '/incidents/1234')
        expect(container.querySelectorAll('div').length).toBe(3)
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', () => {
        const { container } = render([], '/incidents/1234')
        expect(container.querySelectorAll('div').length).not.toBe(3)
      })
    })
  })
})
