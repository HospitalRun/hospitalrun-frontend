import '../../../__mocks__/matchMediaMock'

import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as breadcrumbUtil from '../../../breadcrumbs/useAddBreadcrumbs'
import IncidentRepository from '../../../clients/db/IncidentRepository'
import ViewIncidents from '../../../incidents/list/ViewIncidents'
import Incident from '../../../model/Incident'
import Permissions from '../../../model/Permissions'
import * as ButtonBarProvider from '../../../page-header/ButtonBarProvider'
import * as titleUtil from '../../../page-header/useTitle'
import { RootState } from '../../../store'

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
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(IncidentRepository, 'findAll').mockResolvedValue(expectedIncidents)

    history = createMemoryHistory()
    history.push(`/incidents`)
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
      incidents: {
        incidents: expectedIncidents,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/incidents">
                <ViewIncidents />
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })
    wrapper.update()
    return wrapper
  }

  describe('layout', () => {
    it('should set the title', async () => {
      await setup([Permissions.ViewIncidents])

      expect(titleUtil.default).toHaveBeenCalledWith('incidents.reports.label')
    })

    it('should render a table with the incidents', async () => {
      const wrapper = await setup([Permissions.ViewIncidents])

      const table = wrapper.find('table')
      const tableHeader = table.find('thead')
      const tableBody = table.find('tbody')
      const tableHeaders = tableHeader.find('th')
      const tableColumns = tableBody.find('td')

      expect(tableHeaders.at(0).text()).toEqual('incidents.reports.code')
      expect(tableHeaders.at(1).text()).toEqual('incidents.reports.dateOfIncident')
      expect(tableHeaders.at(2).text()).toEqual('incidents.reports.reportedBy')
      expect(tableHeaders.at(3).text()).toEqual('incidents.reports.reportedOn')
      expect(tableHeaders.at(4).text()).toEqual('incidents.reports.status')

      expect(tableColumns.at(0).text()).toEqual(expectedIncidents[0].code)
      expect(tableColumns.at(1).text()).toEqual('2020-06-03 07:48 PM')
      expect(tableColumns.at(2).text()).toEqual(expectedIncidents[0].reportedBy)
      expect(tableColumns.at(3).text()).toEqual('2020-06-03 07:48 PM')
      expect(tableColumns.at(4).text()).toEqual(expectedIncidents[0].status)
    })
  })

  describe('on table row click', () => {
    it('should navigate to the incident when the table row is clicked', async () => {
      const wrapper = await setup([Permissions.ViewIncidents])

      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.prop('onClick')
        onClick()
      })

      expect(history.location.pathname).toEqual(`/incidents/${expectedIncidents[0].id}`)
    })
  })
})
