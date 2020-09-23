import { Toaster } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
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
import * as titleUtil from '../page-header/title/TitleContext'
import Appointments from '../scheduling/appointments/Appointments'
import Settings from '../settings/Settings'
import ImagingRepository from '../shared/db/ImagingRepository'
import IncidentRepository from '../shared/db/IncidentRepository'
import LabRepository from '../shared/db/LabRepository'
import MedicationRepository from '../shared/db/MedicationRepository'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('HospitalRun', () => {
  const setup = async (route: string, permissions: Permissions[] = []) => {
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    const store = mockStore({
      user: { user: { id: '123' }, permissions },
      appointments: { appointments: [] },
      medications: { medications: [] },
      labs: { labs: [] },
      imagings: { imagings: [] },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    await act(async () => {
      wrapper.update()
    })

    return { wrapper: wrapper as ReactWrapper, store: store as any }
  }

  describe('routing', () => {
    describe('/appointments', () => {
      it('should render the appointments screen when /appointments is accessed', async () => {
        const permissions: Permissions[] = [Permissions.ReadAppointments]
        const { wrapper, store } = await setup('/appointments', permissions)

        expect(wrapper.find(Appointments)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', async () => {
        const { wrapper } = await setup('/appointments')
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/labs', () => {
      it('should render the Labs component when /labs is accessed', async () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewLabs]
        const { wrapper } = await setup('/labs', permissions)

        expect(wrapper.find(ViewLabs)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view labs', async () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const { wrapper } = await setup('/labs')

        expect(wrapper.find(ViewLabs)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/medications', () => {
      it('should render the Medications component when /medications is accessed', async () => {
        jest.spyOn(MedicationRepository, 'search').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewMedications]
        const { wrapper } = await setup('/medications', permissions)

        expect(wrapper.find(ViewMedications)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view medications', async () => {
        jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
        const { wrapper } = await setup('/medications')

        expect(wrapper.find(ViewMedications)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/incidents', () => {
      it('should render the Incidents component when /incidents is accessed', async () => {
        jest.spyOn(IncidentRepository, 'search').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewIncidents]
        const { wrapper } = await setup('/incidents', permissions)

        expect(wrapper.find(Incidents)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view incidents', async () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const { wrapper } = await setup('/incidents')

        expect(wrapper.find(Incidents)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/imaging', () => {
      it('should render the Imagings component when /imaging is accessed', async () => {
        jest.spyOn(ImagingRepository, 'search').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewImagings]
        const { wrapper } = await setup('/imaging', permissions)

        expect(wrapper.find(ViewImagings)).toHaveLength(1)
      })

      it('should render the dashboard if the user does not have permissions to view imagings', async () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        const { wrapper } = await setup('/imaging')

        expect(wrapper.find(ViewImagings)).toHaveLength(0)
        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/settings', () => {
      it('should render the Settings component when /settings is accessed', async () => {
        const { wrapper } = await setup('/settings')
        expect(wrapper.find(Settings)).toHaveLength(1)
      })
    })
  })

  describe('layout', () => {
    it('should render a Toaster', async () => {
      const permissions: Permissions[] = [Permissions.WritePatients]
      const { wrapper } = await setup('/', permissions)

      expect(wrapper.find(Toaster)).toHaveLength(1)
    })
  })
})
