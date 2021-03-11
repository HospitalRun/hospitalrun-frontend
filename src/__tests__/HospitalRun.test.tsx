import { render, screen, within } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import HospitalRun from '../HospitalRun'
import { addBreadcrumbs } from '../page-header/breadcrumbs/breadcrumbs-slice'
import * as titleUtil from '../page-header/title/TitleContext'
import ImagingRepository from '../shared/db/ImagingRepository'
import IncidentRepository from '../shared/db/IncidentRepository'
import LabRepository from '../shared/db/LabRepository'
import MedicationRepository from '../shared/db/MedicationRepository'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('HospitalRun', () => {
  const setup = (route: string, permissions: Permissions[] = []) => {
    const store = mockStore({
      user: { user: { id: '123' }, permissions },
      appointments: { appointments: [] },
      medications: { medications: [] },
      labs: { labs: [] },
      imagings: { imagings: [] },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const results = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    return { ...results, store }
  }

  describe('routing', () => {
    describe('/appointments', () => {
      it('should render the appointments screen when /appointments is accessed', () => {
        const { store } = setup('/appointments', [Permissions.ReadAppointments])

        expect(
          screen.getByRole('heading', { name: /scheduling\.appointments\.label/i }),
        ).toBeInTheDocument()

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        setup('/appointments')

        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
        expect(window.location.pathname).toBe('/')
      })
    })

    describe('/labs', () => {
      it('should render the Labs component when /labs is accessed', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        setup('/labs', [Permissions.ViewLabs])

        const table = screen.getByRole('table')
        expect(within(table).getByText(/labs.lab.code/i)).toBeInTheDocument()
        expect(within(table).getByText(/labs.lab.type/i)).toBeInTheDocument()
        expect(within(table).getByText(/labs.lab.requestedOn/i)).toBeInTheDocument()
        expect(within(table).getByText(/labs.lab.status/i)).toBeInTheDocument()
        expect(within(table).getByText(/actions.label/i)).toBeInTheDocument()
      })

      it('should render the dashboard if the user does not have permissions to view labs', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        setup('/labs')

        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
        expect(window.location.pathname).toBe('/')
      })
    })

    describe('/medications', () => {
      it('should render the Medications component when /medications is accessed', () => {
        jest.spyOn(MedicationRepository, 'search').mockResolvedValue([])
        setup('/medications', [Permissions.ViewMedications])

        const medicationInput = screen.getByRole(/combobox/i) as HTMLInputElement
        expect(medicationInput.value).toBe('medications.filter.all')
        expect(screen.getByLabelText(/medications.search/i)).toBeInTheDocument()
      })

      it('should render the dashboard if the user does not have permissions to view medications', () => {
        jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
        setup('/medications')

        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
        expect(window.location.pathname).toBe('/')
      })
    })

    describe('/incidents', () => {
      it('should render the Incidents component when /incidents is accessed', () => {
        jest.spyOn(IncidentRepository, 'search').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewIncidents]
        setup('/incidents', permissions)

        const incidentInput = screen.getByRole(/combobox/i) as HTMLInputElement
        expect(incidentInput.value).toBe('incidents.status.reported')
        expect(screen.getByRole('button', { name: /incidents.reports.new/i })).toBeInTheDocument()
      })

      it('should render the dashboard if the user does not have permissions to view incidents', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        setup('/incidents')

        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
        expect(window.location.pathname).toBe('/')
      })
    })

    describe('/imaging', () => {
      it('should render the Imagings component when /imaging is accessed', () => {
        jest.spyOn(ImagingRepository, 'search').mockResolvedValue([])
        const permissions: Permissions[] = [Permissions.ViewImagings]
        setup('/imaging', permissions)

        expect(screen.getByRole('heading', { name: /imagings.label/i })).toBeInTheDocument()
      })

      it('should render the dashboard if the user does not have permissions to view imagings', () => {
        jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
        setup('/imaging')

        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
        expect(window.location.pathname).toBe('/')
      })
    })

    describe('/settings', () => {
      it('should render the Settings component when /settings is accessed', () => {
        setup('/settings')

        expect(screen.getByText(/settings.language.label/i)).toBeInTheDocument()
      })
    })
  })

  describe('layout', () => {
    it('should render a Toaster', () => {
      const permissions: Permissions[] = [Permissions.WritePatients]
      setup('/', permissions)

      const main = screen.getByRole('main')
      expect(main.lastChild).toHaveClass('Toastify')
    })
  })
})
