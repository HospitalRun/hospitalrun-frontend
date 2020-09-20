import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import IncidentFilter from '../../../incidents/IncidentFilter'
import ViewIncidents from '../../../incidents/list/ViewIncidents'
import ViewIncidentsTable from '../../../incidents/list/ViewIncidentsTable'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Incidents', () => {
  let history: any
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
  const setup = async (permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(IncidentRepository, 'findAll').mockResolvedValue(expectedIncidents)
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

    history = createMemoryHistory()
    history.push(`/incidents`)
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
              <Route path="/incidents">
                <titleUtil.TitleProvider>
                  <ViewIncidents />
                </titleUtil.TitleProvider>
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })
    wrapper.find(ViewIncidents).props().updateTitle = jest.fn()
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  it('should have called the useUpdateTitle hook', async () => {
    await setup([Permissions.ViewIncidents])
    expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
  })

  it('should filter incidents by status=reported on first load ', async () => {
    await setup([Permissions.ViewIncidents])

    expect(IncidentRepository.search).toHaveBeenCalled()
    expect(IncidentRepository.search).toHaveBeenCalledWith({ status: IncidentFilter.reported })
  })

  describe('layout', () => {
    it('should render a table with the incidents', async () => {
      const { wrapper } = await setup([Permissions.ViewIncidents])
      const table = wrapper.find(ViewIncidentsTable)

      expect(table.exists()).toBeTruthy()
      expect(table.prop('searchRequest')).toEqual({ status: IncidentFilter.reported })
    })
  })
})
