import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { ButtonBarProvider } from '../../../page-header/button-toolbar/ButtonBarProvider'
import { TitleProvider } from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const setup = (permissions: Permissions[], id: string | undefined) => {
  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue({
    id,
    date: new Date().toISOString(),
    code: 'some code',
    reportedOn: new Date().toISOString(),
  } as Incident)

  const history = createMemoryHistory({ initialEntries: [`/incidents/${id}`] })
  const store = mockStore({
    user: {
      permissions,
    },
  } as any)

  return {
    history,
    ...render(
      <ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/incidents/:id">
              <TitleProvider>
                <ViewIncident />
              </TitleProvider>
            </Route>
          </Router>
        </Provider>
      </ButtonBarProvider>,
    ),
  }
}

it('should not render ViewIncidentDetails if there are no Permissions', async () => {
  setup(undefined, '1234')

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})

it('should not  ViewIncidentDetails no there is no ID', async () => {
  setup([Permissions.ReportIncident, Permissions.ResolveIncident], undefined)

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})
