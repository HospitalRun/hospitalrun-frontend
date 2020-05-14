import '../../__mocks__/matchMediaMock'

import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import IncidentRepository from '../../clients/db/IncidentRepository'
import Incidents from '../../incidents/Incidents'
import ReportIncident from '../../incidents/report/ReportIncident'
import ViewIncident from '../../incidents/view/ViewIncident'
import Incident from '../../model/Incident'
import Permissions from '../../model/Permissions'

const mockStore = configureMockStore([thunk])

describe('Incidents', () => {
  describe('routing', () => {
    describe('/incidents/new', () => {
      it('should render the new incident screen when /incidents/new is accessed', () => {
        const expectedIncident = {
          id: '1234',
          code: '1234',
        } as Incident
        jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ReportIncident] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          incident: {
            incident: expectedIncident,
          },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/incidents/new']}>
              <Incidents />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ReportIncident)).toHaveLength(1)
      })

      it('should not navigate to /incidents/new if the user does not have ReportIncident permissions', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/incidents/new']}>
              <Incidents />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ReportIncident)).toHaveLength(0)
      })
    })

    describe('/incidents/:id', () => {
      it('should render the view incident screen when /incidents/:id is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ViewIncident] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          incident: {
            incident: {
              id: '1234',
              code: '1234 ',
              date: new Date().toISOString(),
              reportedOn: new Date().toISOString(),
            },
          },
        })

        let wrapper: any

        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/incidents/1234']}>
                <Incidents />
              </MemoryRouter>
            </Provider>,
          )

          expect(wrapper.find(ViewIncident)).toHaveLength(1)
        })
      })

      it('should not navigate to /incidents/:id if the user does not have ViewIncident permissions', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = await mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/incidents/1234']}>
              <Incidents />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewIncident)).toHaveLength(0)
      })
    })
  })
})
