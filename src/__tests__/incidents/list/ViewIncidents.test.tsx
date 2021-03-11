import { render, screen, within } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncidents from '../../../incidents/list/ViewIncidents'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const expectedDate = new Date(2020, 5, 3, 19, 48)
const expectedIncidents = [
  {
    id: '123',
    code: 'some code',
    status: 'reported',
    reportedBy: 'some user id',
    date: expectedDate.toISOString(),
    reportedOn: expectedDate.toISOString(),
  },
] as Incident[]

let setButtonToolBarSpy: any
const setup = (permissions: Permissions[]) => {
  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  setButtonToolBarSpy = jest.fn()
  jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
  jest.spyOn(IncidentRepository, 'findAll').mockResolvedValue(expectedIncidents)
  jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

  const history = createMemoryHistory({ initialEntries: [`/incidents`] })
  const store = mockStore({ user: { permissions } } as any)

  return render(
    <Provider store={store}>
      <ButtonBarProvider.ButtonBarProvider>
        <Router history={history}>
          <Route path="/incidents">
            <titleUtil.TitleProvider>
              <ViewIncidents />
            </titleUtil.TitleProvider>
          </Route>
        </Router>
      </ButtonBarProvider.ButtonBarProvider>
    </Provider>,
  )
}

it('should filter incidents by status=reported on first load ', () => {
  setup([Permissions.ViewIncidents])
  expect(screen.getByRole('combobox')).toHaveValue('incidents.status.reported')
})

describe('layout', () => {
  it('should render a table with the incidents', async () => {
    setup([Permissions.ViewIncidents])
    expect(within(await screen.findByRole('table')).getByText('some code')).toBeInTheDocument()
  })
})
