import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import ViewIncidentDetails from '../../../incidents/view/ViewIncidentDetails'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('View Incident', () => {
  const setup = async (permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue({
      id: '1234',
      date: new Date().toISOString(),
      code: 'some code',
      reportedOn: new Date().toISOString(),
    } as Incident)
    const history = createMemoryHistory()
    history.push(`/incidents/1234`)

    const store = mockStore({
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
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
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should set the breadcrumbs properly', async () => {
    await setup([Permissions.ViewIncident])

    expect(breadcrumbUtil.default).toHaveBeenCalledWith([
      { i18nKey: 'incidents.reports.view', location: '/incidents/1234' },
    ])
  })

  it('should render ViewIncidentDetails', async () => {
    const permissions = [Permissions.ReportIncident, Permissions.ResolveIncident]
    const { wrapper } = await setup(permissions)

    const viewIncidentDetails = wrapper.find(ViewIncidentDetails)
    expect(viewIncidentDetails.exists()).toBeTruthy()
    expect(viewIncidentDetails.prop('permissions')).toEqual(permissions)
    expect(viewIncidentDetails.prop('incidentId')).toEqual('1234')
  })
})
