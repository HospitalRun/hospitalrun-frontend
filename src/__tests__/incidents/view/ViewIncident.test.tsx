import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const setup = (permissions: any[] | undefined, id: string | undefined) => {
  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue({
    id,
    date: new Date().toISOString(),
    code: 'some code',
    reportedOn: new Date().toISOString(),
  } as Incident)
  const history = createMemoryHistory()
  history.push(`/incidents/${id}`)

  const store = mockStore({
    user: {
      permissions,
    },
  } as any)

  const renderResults = render(
    <ButtonBarProvider.ButtonBarProvider>
      <Provider store={store}>
        <Router history={history}>
          <Route path="/incidents/:id">
            <TitleProvider>
              <ViewIncident />
            </TitleProvider>
          </Route>
        </Router>
      </Provider>
    </ButtonBarProvider.ButtonBarProvider>,
  )

  return { ...renderResults, history }
}

// it('should set the breadcrumbs properly', async () => {
//   setup([Permissions.ViewIncident], '1234')

//   expect(breadcrumbUtil.default).toHaveBeenCalledWith([
//     { i18nKey: 'incidents.reports.view', location: '/incidents/1234' },
//   ])
// })

it('smoke test ViewIncidentDetails no Permissions', async () => {
  setup(undefined, '1234')

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})

it('smoke test ViewIncidentDetails no ID', async () => {
  setup([Permissions.ReportIncident, Permissions.ResolveIncident], undefined)

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})
