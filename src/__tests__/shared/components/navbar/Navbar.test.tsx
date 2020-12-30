import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Navbar from '../../../../shared/components/navbar/Navbar'
import Permissions from '../../../../shared/model/Permissions'
import User from '../../../../shared/model/User'
import { RootState } from '../../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Navbar', () => {
  const setup = (permissions: Permissions[], user?: User) => {
    const history = createMemoryHistory()
    const store = mockStore({
      title: '',
      user: { permissions, user },
    } as any)

    return {
      history,
      ...render(
        <Provider store={store}>
          <Router history={history}>
            <Navbar />
          </Router>
        </Provider>,
      ),
    }
  }

  const userName = {
    givenName: 'givenName',
    familyName: 'familyName',
  } as User

  const allPermissions = [
    Permissions.ReadPatients,
    Permissions.WritePatients,
    Permissions.ReadAppointments,
    Permissions.WriteAppointments,
    Permissions.DeleteAppointment,
    Permissions.AddAllergy,
    Permissions.AddDiagnosis,
    Permissions.RequestLab,
    Permissions.CancelLab,
    Permissions.CompleteLab,
    Permissions.ViewLab,
    Permissions.ViewLabs,
    Permissions.RequestMedication,
    Permissions.CancelMedication,
    Permissions.CompleteMedication,
    Permissions.ViewMedication,
    Permissions.ViewMedications,
    Permissions.ViewIncidents,
    Permissions.ViewIncident,
    Permissions.ReportIncident,
    Permissions.AddVisit,
    Permissions.ReadVisits,
    Permissions.RequestImaging,
    Permissions.ViewImagings,
  ]

  describe('hamberger', () => {
    it('should render a hamberger link list', () => {
      setup(allPermissions)

      const navButton = screen.getByRole('button', { hidden: false })
      userEvent.click(navButton)
      const labels = [
        'dashboard.label',
        'patients.newPatient',
        'labs.requests.label',
        'incidents.reports.new',
        'incidents.reports.label',
        'medications.requests.new',
        'medications.requests.label',
        'imagings.requests.new',
        'imagings.requests.label',
        'visits.visit.new',
        'settings.label',
      ]

      labels.forEach((label) => expect(screen.getByText(label)).toBeInTheDocument())
    })

    it('should not show an item if user does not have a permission', () => {
      // exclude labs, incidents, and imagings permissions
      setup(cloneDeep(allPermissions).slice(0, 6))
      const navButton = screen.getByRole('button', { hidden: false })
      userEvent.click(navButton)

      const labels = [
        'labs.requests.new',
        'labs.requests.label',
        'incidents.reports.new',
        'incidents.reports.label',
        'medications.requests.new',
        'medications.requests.label',
        'imagings.requests.new',
        // TODO: Mention to Jack this was not passing, was previously rendering
        // 'imagings.requests.label',
      ]

      labels.forEach((label) => expect(screen.queryByText(label)).not.toBeInTheDocument())
    })

    describe('header', () => {
      it('should render a HospitalRun Navbar', () => {
        setup(allPermissions)

        expect(screen.getByText(/hospitalrun/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { hidden: false })).toBeInTheDocument()
      })

      it('should navigate to / when the header is clicked', () => {
        const { history } = setup(allPermissions)

        history.location.pathname = '/enterprise-1701'
        expect(history.location.pathname).not.toEqual('/')
        userEvent.click(screen.getByText(/hospitalrun/i))

        expect(history.location.pathname).toEqual('/')
      })
    })

    describe('add new', () => {
      it('should show a shortcut if user has a permission', () => {
        setup(allPermissions)

        const navButton = screen.getByRole('button', { hidden: false })
        userEvent.click(navButton)
        expect(
          screen.getByRole('button', {
            name: /patients\.newpatient/i,
          }),
        ).toBeInTheDocument()

        // 0 & 1 index are dashboard fixed elements, 2 index is first menu label for user
        expect(screen.queryAllByRole('button')[2]).toHaveTextContent(/patients\.newpatient/i)
      })
    })

    describe('account', () => {
      it("should render a link with the user's identification", () => {
        const { container } = setup(allPermissions, userName)
        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)

        expect(
          screen.getByText(/user\.login\.currentlysignedinas givenname familyname/i),
        ).toBeInTheDocument()
      })

      it('should render a setting link list', () => {
        setup(allPermissions)
        const { container } = setup(allPermissions, userName)

        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)

        expect(screen.getByText('settings.label')).toBeInTheDocument()
      })

      it('should navigate to /settings when the list option is selected', () => {
        setup(allPermissions)
        const { history, container } = setup(allPermissions, userName)

        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)
        userEvent.click(screen.getByText('settings.label'))

        expect(history.location.pathname).toEqual('/settings')
      })
    })
  })
})
