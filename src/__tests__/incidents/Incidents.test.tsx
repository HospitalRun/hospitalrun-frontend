import { render as rtlRender, screen, waitForElementToBeRemoved } from '@testing-library/react'
import React, { ReactNode } from 'react'
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
  const expectedIncident = {
    id: '1234',
    code: '1234',
    date: new Date().toISOString(),
    reportedOn: new Date().toISOString(),
    reportedBy: 'some user',
  } as Incident

  function render(permissions: Permissions[], path: string) {
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue([])
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)
    const store = mockStore({
      user: { permissions },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    function Wrapper({ children }: WrapperProps) {
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
          </MemoryRouter>
        </Provider>
      )
    }

    return rtlRender(<Incidents />, { wrapper: Wrapper })
  }

  describe('routing', () => {
    describe('/incidents/new', () => {
      it('The new incident screen when /incidents/new is accessed', () => {
        render([Permissions.ReportIncident], '/incidents/new')
        expect(screen.getByRole('form', { name: /report incident form/i })).toBeInTheDocument()
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', () => {
        const { container } = render([], '/incidents/new')
        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })

    describe('/incidents/visualize', () => {
      it('The incident visualize screen when /incidents/visualize is accessed', async () => {
        const { container } = render([Permissions.ViewIncidentWidgets], '/incidents/visualize')
        await waitForElementToBeRemoved(() => container.querySelector('.css-1jydqjy'))
        expect(container.querySelector('canvas')).toBeInTheDocument()
      })

      it('should not navigate to /incidents/visualize if the user does not have ViewIncidentWidgets permissions', () => {
        const { container } = render([], '/incidents/visualize')
        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })

    describe('/incidents/:id', () => {
      it('The view incident screen when /incidents/:id is accessed', async () => {
        const { container } = render(
          [Permissions.ViewIncident],
          `/incidents/${expectedIncident.id}`,
        )
        await waitForElementToBeRemoved(() => container.querySelector('.css-1jydqjy'))
        expect(screen.getByText(expectedIncident.reportedBy)).toBeInTheDocument()
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', async () => {
        const { container } = render([], `/incidents/${expectedIncident.id}`)
        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })
  })
})
