import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { act } from '@testing-library/react'
import Permissions from 'model/Permissions'
import ViewIncident from '../../incidents/view/ViewIncident'
import Incidents from '../../incidents/Incidents'
import ReportIncident from '../../incidents/report/ReportIncident'

const mockStore = configureMockStore([thunk])

describe('Incidents', () => {
  describe('routing', () => {
    describe('/incidents/new', () => {
      it('should render the new lab request screen when /incidents/new is accessed', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ReportIncident] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          incident: {},
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

      it('should not navigate to /incidents/new if the user does not have RequestLab permissions', () => {
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
      it('should render the view lab screen when /incidents/:id is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ViewIncident] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
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
