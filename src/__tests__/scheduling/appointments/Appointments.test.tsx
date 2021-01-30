import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import HospitalRun from '../../../HospitalRun'
import { addBreadcrumbs } from '../../../page-header/breadcrumbs/breadcrumbs-slice'
import * as titleUtil from '../../../page-header/title/TitleContext'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const setup = (url: string, permissions: Permissions[]) => {
  const history = createMemoryHistory({ initialEntries: [url] })
  const store = mockStore({
    user: { user: { id: '123' }, permissions },
    breadcrumbs: { breadcrumbs: [] },
    components: { sidebarCollapsed: false },
  } as any)

  return {
    history,
    store,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </Router>
      </Provider>,
    ),
  }
}

describe('/appointments', () => {
  it('should render the appointments screen when /appointments is accessed', async () => {
    const { store } = setup('/appointments', [Permissions.ReadAppointments])

    expect(
      await screen.findByRole('heading', { name: /scheduling\.appointments\.label/i }),
    ).toBeInTheDocument()

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read appointment privileges', async () => {
    setup('/appointments', [])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})

describe('/appointments/new', () => {
  it('should render the new appointment screen when /appointments/new is accessed', async () => {
    const { store } = setup('/appointments/new', [Permissions.WriteAppointments])

    expect(
      await screen.findByRole('heading', { name: /scheduling\.appointments\.new/i }),
    ).toBeInTheDocument()

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
        { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read appointment privileges', async () => {
    setup('/appointments/new', [])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})

describe('/appointments/edit/:id', () => {
  it('should render the edit appointment screen when /appointments/edit/:id is accessed', async () => {
    setup('/appointments/edit/123', [Permissions.WriteAppointments, Permissions.ReadAppointments])

    expect(
      await screen.findByRole('heading', { name: /scheduling\.appointments\.editAppointment/i }),
    ).toBeInTheDocument()
  })

  it('should render the Dashboard when the user does not have read appointment privileges', async () => {
    setup('/appointments/edit/123', [Permissions.WriteAppointments])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })

  it('should render the Dashboard when the user does not have write appointment privileges', async () => {
    setup('/appointments/edit/123', [Permissions.ReadAppointments])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})
