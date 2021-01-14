import { Button } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
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
  let incidentRepositorySaveSpy: any
  const queryCache = new QueryCache()
  const expectedResolveDate = new Date()
  const mockedIncident: Incident = {
    id: '1234',
    code: 'some code',
    department: 'some department',
    description: 'some description',
    category: 'some category',
    categoryItem: 'some category item',
    status: 'reported',
    reportedBy: 'some user id',
    reportedOn: new Date().toISOString(),
    date: new Date().toISOString(),
  } as Incident
  const setup = async (permissions: Permissions[], incident: Incident) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedResolveDate.valueOf())
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(incident)
    const history = createMemoryHistory()
    history.push(`/incidents/1234`)
    incidentRepositorySaveSpy = jest
      .spyOn(IncidentRepository, 'saveOrUpdate')
      .mockResolvedValue(mockedIncident)

    const store = mockStore({
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ReactQueryCacheProvider queryCache={queryCache}>
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
          </ButtonBarProvider.ButtonBarProvider>
          ,
        </ReactQueryCacheProvider>,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  afterEach(() => {
    jest.restoreAllMocks()
    queryCache.clear()
  })

  it('should not display a resolve incident button if the user has no ResolveIncident access', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const resolveButton = wrapper.find('Button[color="primary"]')
    expect(resolveButton).toHaveLength(0)
  })

  it('should not display a resolve incident button if the incident is resolved', async () => {
    const mockIncident = { ...mockedIncident, status: 'resolved' } as Incident
    const { wrapper } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockIncident,
    )

    const resolveButton = wrapper.find('Button[color="primary"]')
    expect(resolveButton).toHaveLength(0)
  })

  it('should display a resolve incident button if the incident is in a reported state', async () => {
    const { wrapper } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockedIncident,
    )
    const buttons = wrapper.find('Button[color="primary"]')
    expect(buttons.at(0).text().trim()).toEqual('incidents.reports.resolve')
  })

  it('should render ViewIncidentDetails', async () => {
    const permissions = [Permissions.ResolveIncident, Permissions.ReportIncident]
    const { wrapper } = await setup(permissions, mockedIncident)

    const viewIncidentDetails = wrapper.find(ViewIncidentDetails)
    expect(viewIncidentDetails.exists()).toBeTruthy()
    expect(viewIncidentDetails.prop('incident')).toEqual(mockedIncident)
  })

  it('should call find incident by id', async () => {
    await setup([Permissions.ViewIncident], mockedIncident)

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.find).toHaveBeenCalledWith(mockedIncident.id)
  })

  it('should set the breadcrumbs properly', async () => {
    await setup([Permissions.ViewIncident], mockedIncident)

    expect(breadcrumbUtil.default).toHaveBeenCalledWith([
      { i18nKey: 'incidents.reports.view', location: '/incidents/1234' },
    ])
  })

  it('should mark the status as resolved and fill in the resolved date with the current time', async () => {
    const { wrapper, history } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockedIncident,
    )

    const resolveButton = wrapper.find('Button[color="primary"]').at(0)
    await act(async () => {
      const onClick = resolveButton.prop('onClick') as any
      await onClick()
    })
    wrapper.update()

    expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
    expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockedIncident,
        status: 'resolved',
        resolvedOn: expectedResolveDate.toISOString(),
      }),
    )
    expect(history.location.pathname).toEqual('/incidents')
  })
})
