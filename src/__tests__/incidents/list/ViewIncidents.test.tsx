import { Table } from '@hospitalrun/components'
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
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/useTitle'
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
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(IncidentRepository, 'findAll').mockResolvedValue(expectedIncidents)
    jest.spyOn(IncidentRepository, 'search').mockResolvedValue(expectedIncidents)

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
    return wrapper as ReactWrapper
  }
  it('should filter incidents by status=reported on first load ', async () => {
    await setup([Permissions.ViewIncidents])

    expect(IncidentRepository.search).toHaveBeenCalled()
    expect(IncidentRepository.search).toHaveBeenCalledWith({ status: IncidentFilter.reported })
  })

  describe('layout', () => {
    it('should set the title', async () => {
      await setup([Permissions.ViewIncidents])

      expect(titleUtil.default).toHaveBeenCalledWith('incidents.reports.label')
    })

    it('should render a table with the incidents', async () => {
      const wrapper = await setup([Permissions.ViewIncidents])
      const table = wrapper.find(Table)
      const columns = table.prop('columns')
      const actions = table.prop('actions') as any
      expect(columns[0]).toEqual(
        expect.objectContaining({ label: 'incidents.reports.code', key: 'code' }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'incidents.reports.dateOfIncident', key: 'date' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'incidents.reports.reportedBy', key: 'reportedBy' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({ label: 'incidents.reports.reportedOn', key: 'reportedOn' }),
      )
      expect(columns[4]).toEqual(
        expect.objectContaining({ label: 'incidents.reports.status', key: 'status' }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual(expectedIncidents)
    })
  })

  describe('on view button click', () => {
    it('should navigate to the incident when the table row is clicked', async () => {
      const wrapper = await setup([Permissions.ViewIncidents])

      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual(`/incidents/${expectedIncidents[0].id}`)
    })
  })
})
