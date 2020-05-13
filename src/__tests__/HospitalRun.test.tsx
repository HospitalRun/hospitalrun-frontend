import '../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { Toaster } from '@hospitalrun/components'
import { act } from 'react-dom/test-utils'
import Dashboard from 'dashboard/Dashboard'
import ViewLabs from 'labs/ViewLabs'
import LabRepository from 'clients/db/LabRepository'
import { addBreadcrumbs } from 'breadcrumbs/breadcrumbs-slice'
import Appointments from 'scheduling/appointments/Appointments'
import HospitalRun from '../HospitalRun'
import Permissions from '../model/Permissions'
import Incidents from '../incidents/Incidents'

const mockStore = configureMockStore([thunk])

describe('HospitalRun', () => {
  describe('routing', () => {
    describe('/appointments', () => {
      it('should render the appointments screen when /appointments is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ReadAppointments] },
          appointments: { appointments: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          incidents: { incidents: [] },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        await act(async () => {
          wrapper.update()
        })

        expect(wrapper.find(Appointments)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/labs', () => {
      it('should render the Labs component when /labs is accessed', async () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ViewLabs] },
          labs: { labs: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        let wrapper: any
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/labs']}>
                <HospitalRun />
              </MemoryRouter>
            </Provider>,
          )
        })
        wrapper.update()

        expect(wrapper.find(ViewLabs)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view labs', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/labs']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewLabs)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/incidents', () => {
      it('should render the Incidents component when /incidents is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ViewIncidents] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          incidents: { incidents: [] },
        })

        let wrapper: any
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/incidents']}>
                <HospitalRun />
              </MemoryRouter>
            </Provider>,
          )
        })
        wrapper.update()

        expect(wrapper.find(Incidents)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view incidents', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/incidents']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Incidents)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })
  })

  describe('layout', () => {
    it('should render a Toaster', () => {
      const wrapper = mount(
        <Provider
          store={mockStore({
            title: 'test',
            user: { permissions: [Permissions.WritePatients] },
            breadcrumbs: { breadcrumbs: [] },
            components: { sidebarCollapsed: false },
          })}
        >
          <MemoryRouter initialEntries={['/']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )

      expect(wrapper.find(Toaster)).toHaveLength(1)
    })
  })
})
