import { Toaster } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Dashboard from '../dashboard/Dashboard'
import HospitalRun from '../HospitalRun'
import ViewImagings from '../imagings/search/ViewImagings'
import Incidents from '../incidents/Incidents'
import ViewLabs from '../labs/ViewLabs'
import ViewMedications from '../medications/search/ViewMedications'
import { addBreadcrumbs } from '../page-header/breadcrumbs/breadcrumbs-slice'
import Appointments from '../scheduling/appointments/Appointments'
import Settings from '../settings/Settings'
import ImagingRepository from '../shared/db/ImagingRepository'
import IncidentRepository from '../shared/db/IncidentRepository'
import LabRepository from '../shared/db/LabRepository'
import MedicationRepository from '../shared/db/MedicationRepository'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('HospitalRun', () => {
  describe('routing', () => {
    describe('/appointments', () => {
      it('should render the appointments screen when /appointments is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.ReadAppointments] },
          appointments: { appointments: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

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
              user: { user: { id: '123' }, permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            } as any)}
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
          user: { user: { id: '123' }, permissions: [Permissions.ViewLabs] },
          labs: { labs: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

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
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

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

    describe('/medications', () => {
      it('should render the Medications component when /medications is accessed', async () => {
        jest.spyOn(MedicationRepository, 'search').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.ViewMedications] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        let wrapper: any
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/medications']}>
                <HospitalRun />
              </MemoryRouter>
            </Provider>,
          )
        })
        wrapper.update()

        expect(wrapper.find(ViewMedications)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view medications', () => {
        jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/medications']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewMedications)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/incidents', () => {
      it('should render the Incidents component when /incidents is accessed', async () => {
        jest.spyOn(IncidentRepository, 'search').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.ViewIncidents] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

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
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

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

    describe('/imaging', () => {
      it('should render the Imagings component when /imaging is accessed', async () => {
        jest.spyOn(ImagingRepository, 'search').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.ViewImagings] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        let wrapper: any
        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/imaging']}>
                <HospitalRun />
              </MemoryRouter>
            </Provider>,
          )
        })
        wrapper.update()

        expect(wrapper.find(ViewImagings)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view imagings', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/imaging']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewImagings)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/settings', () => {
      it('should render the Settings component when /settings is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/settings']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Settings)).toHaveLength(1)
      })
    })
  })

  describe('layout', () => {
    it('should render a Toaster', () => {
      const wrapper = mount(
        <Provider
          store={mockStore({
            title: 'test',
            user: { user: { id: '123' }, permissions: [Permissions.WritePatients] },
            breadcrumbs: { breadcrumbs: [] },
            components: { sidebarCollapsed: false },
          } as any)}
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
