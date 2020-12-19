import { render as rtlRender, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React, { FC, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Sidebar from '../../../shared/components/Sidebar'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Sidebar', () => {
  let history = createMemoryHistory()
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
    Permissions.CompleteMedication,
    Permissions.CancelMedication,
    Permissions.ViewMedications,
    Permissions.ViewMedication,
    Permissions.ViewIncidents,
    Permissions.ViewIncident,
    Permissions.ViewIncidentWidgets,
    Permissions.ReportIncident,
    Permissions.ReadVisits,
    Permissions.AddVisit,
    Permissions.RequestImaging,
    Permissions.ViewImagings,
  ]
  const store = mockStore({
    components: { sidebarCollapsed: false },
    user: { permissions: allPermissions },
  } as any)
  const render = (location: string) => {
    history = createMemoryHistory()
    history.push(location)
    const Wrapper = ({ children }: { children: ReactElement }) => (
      <Router history={history}>
        <Provider store={store}>{children}</Provider>
      </Router>
    )
    return rtlRender(<Sidebar />, { wrapper: Wrapper as FC })
  }

  const renderNoPermissions = (location: string) => {
    history = createMemoryHistory()
    history.push(location)
    const Wrapper = ({ children }: { children: ReactElement }) => (
      <Router history={history}>
        <Provider
          store={mockStore({
            components: { sidebarCollapsed: false },
            user: { permissions: [] },
          } as any)}
        >
          {children}
        </Provider>
      </Router>
    )
    return rtlRender(<Sidebar />, { wrapper: Wrapper as FC })
  }

  /*   const getIndex = (wrapper: ReactWrapper, label: string) =>
    wrapper.reduce((result, item, index) => (item.text().trim() === label ? index : result), -1) */

  describe('dashboard links', () => {
    it('should render the dashboard link', () => {
      render('/')

      expect(screen.getByText(/dashboard.label/i)).toBeInTheDocument()
    })

    it('should be active when the current path is /', () => {
      const { container } = render('/')
      const activeElement = container.querySelector('.active')

      expect(activeElement).toBeInTheDocument()
    })

    it('should navigate to / when the dashboard link is clicked', () => {
      render('/patients')

      userEvent.click(screen.getByText(/dashboard.label/i))

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients links', () => {
    it('should render the patients main link', () => {
      render('/')

      expect(screen.getByText(/patients.label/i)).toBeInTheDocument()
    })

    it('should render the new_patient link', () => {
      render('/patients')

      expect(screen.getByText(/patients.newPatient/i)).toBeInTheDocument()
    })

    it('should not render the new_patient link when the user does not have write patient privileges', () => {
      renderNoPermissions('/patients')

      expect(screen.queryByText(/patients.newPatient/i)).not.toBeInTheDocument()
    })

    it('should render the patients_list link', () => {
      render('/patients')

      expect(screen.getByText(/patients.patientsList/i)).toBeInTheDocument()
    })

    it('should not render the patients_list link when the user does not have read patient privileges', () => {
      renderNoPermissions('/patients')

      expect(screen.queryByText(/patients.patientsList/i)).not.toBeInTheDocument()
    })

    it('main patients link should be active when the current path is /patients', () => {
      const { container } = render('/patients')

      expect(container.querySelector('.active')).toHaveTextContent(/patients.label/i)
    })

    it('should navigate to /patients when the patients main link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/patients.label/i))

      expect(history.location.pathname).toEqual('/patients')
    })

    it('new patient should be active when the current path is /patients/new', () => {
      const { container } = render('/patients/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/patients.newPatient/i)
    })

    it('should navigate to /patients/new when the patients new link is clicked', () => {
      render('/patients')
      userEvent.click(screen.getByText(/patients.newPatient/i))

      expect(history.location.pathname).toEqual('/patients/new')
    })

    it('patients list link should be active when the current path is /patients', () => {
      const { container } = render('/patients')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/patients.patientsList/i)
    })

    it('should navigate to /patients when the patients list link is clicked', () => {
      render('/patients')

      userEvent.click(screen.getByText(/patients.patientsList/i))
      expect(history.location.pathname).toEqual('/patients')
    })
  })

  describe('appointments link', () => {
    it('should render the scheduling link', () => {
      render('/appointments')

      expect(screen.getByText(/scheduling.label/i)).toBeInTheDocument()
    })

    it('should render the new appointment link', () => {
      render('/appointments/new')

      expect(screen.getByText(/scheduling.appointments.new/i)).toBeInTheDocument()
    })

    it('should not render the new appointment link when the user does not have write appointments privileges', () => {
      renderNoPermissions('/appointments')

      expect(screen.queryByText(/scheduling.appointments.new/i)).not.toBeInTheDocument()
    })

    it('should render the appointments schedule link', () => {
      render('/appointments')

      expect(screen.getByText(/scheduling.appointments.schedule/i)).toBeInTheDocument()
    })

    it('should not render the appointments schedule link when the user does not have read appointments privileges', () => {
      renderNoPermissions('/appointments')

      expect(screen.queryByText(/scheduling.appointments.schedule/i)).not.toBeInTheDocument()
    })

    it('main scheduling link should be active when the current path is /appointments', () => {
      const { container } = render('/appointments')

      expect(container.querySelector('.active')).toHaveTextContent(/scheduling.label/i)
    })

    it('should navigate to /appointments when the main scheduling link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/scheduling.label/i))

      expect(history.location.pathname).toEqual('/appointments')
    })

    it('new appointment link should be active when the current path is /appointments/new', () => {
      const { container } = render('/appointments/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/appointments.new/i)
    })

    it('should navigate to /appointments/new when the new appointment link is clicked', () => {
      render('/appointments')
      userEvent.click(screen.getByText(/scheduling.appointments.new/i))

      expect(history.location.pathname).toEqual('/appointments/new')
    })

    it('appointments schedule link should be active when the current path is /appointments', () => {
      const { container } = render('/appointments')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(
        /scheduling.appointments.schedule/i,
      )
    })

    it('should navigate to /appointments when the appointments schedule link is clicked', () => {
      render('/appointments')

      userEvent.click(screen.getByText(/scheduling.appointments.schedule/i))

      expect(history.location.pathname).toEqual('/appointments')
    })
  })

  describe('labs links', () => {
    it('should render the main labs link', () => {
      render('/labs')

      expect(screen.getByText(/labs.label/i)).toBeInTheDocument()
    })

    it('should render the new labs request link', () => {
      render('/labs')

      expect(screen.getByText(/labs.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new labs request link when user does not have request labs privileges', () => {
      renderNoPermissions('/labs')

      expect(screen.queryByText(/labs.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the labs list link', () => {
      render('/labs')

      expect(screen.getByText(/labs.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the labs list link when user does not have view labs privileges', () => {
      renderNoPermissions('/labs')

      expect(screen.queryByText(/labs.requests.label/i)).not.toBeInTheDocument()
    })

    it('main labs link should be active when the current path is /labs', () => {
      const { container } = render('/labs')

      expect(container.querySelector('.active')).toHaveTextContent(/labs.label/i)
    })

    it('should navigate to /labs when the main lab link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/labs.label/i))

      expect(history.location.pathname).toEqual('/labs')
    })

    it('new lab request link should be active when the current path is /labs/new', () => {
      const { container } = render('/labs/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/labs.requests.new/i)
    })

    it('should navigate to /labs/new when the new labs link is clicked', () => {
      render('/labs')

      userEvent.click(screen.getByText(/labs.requests.new/))

      expect(history.location.pathname).toEqual('/labs/new')
    })

    it('labs list link should be active when the current path is /labs', () => {
      const { container } = render('/labs')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/labs.requests.label/i)
    })

    it('should navigate to /labs when the labs list link is clicked', () => {
      render('/labs')

      userEvent.click(screen.getByText(/labs.label/i))

      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('incident links', () => {
    it('should render the main incidents link', () => {
      render('/incidents')

      expect(screen.getByText(/incidents.label/i)).toBeInTheDocument()
    })

    it('should render the new incident report link', () => {
      render('/incidents')

      expect(screen.getByText(/incidents.reports.new/i)).toBeInTheDocument()
    })

    it.skip('should be the last one in the sidebar', () => {
      render('/incidents')

      screen.debug(wrapper)
      const listItems = wrapper.find(ListItem)
      const reportsLabel = listItems.length - 2

      expect(listItems.at(reportsLabel).text().trim()).toBe('incidents.reports.label')
      expect(
        listItems
          .at(reportsLabel - 1)
          .text()
          .trim(),
      ).toBe('incidents.reports.new')
      expect(
        listItems
          .at(reportsLabel - 2)
          .text()
          .trim(),
      ).toBe('incidents.label')
    })

    it('should not render the new incident report link when user does not have the report incidents privileges', () => {
      renderNoPermissions('/incidents')

      expect(screen.queryByText(/incidents.reports.new/i)).not.toBeInTheDocument()
    })

    it('should render the incidents list link', () => {
      render('/incidents')

      expect(screen.getByText(/incidents.reports.label/i)).toBeInTheDocument()
    })

    it('should not render the incidents list link when user does not have the view incidents privileges', () => {
      renderNoPermissions('/incidents')

      expect(screen.queryByText(/incidents.reports.label/i)).not.toBeInTheDocument()
    })

    it('should render the incidents visualize link', () => {
      render('/incidents')

      expect(screen.getByText(/incidents.visualize.label/i)).toBeInTheDocument()
    })

    it('should not render the incidents visualize link when user does not have the view incident widgets privileges', () => {
      renderNoPermissions('/incidents')

      expect(screen.queryByText(/incidents.visualize.label/i)).not.toBeInTheDocument()
    })

    it('main incidents link should be active when the current path is /incidents', () => {
      const { container } = render('/incidents')

      expect(container.querySelector('.active')).toHaveTextContent(/incidents.labe/i)
    })

    it('should navigate to /incidents when the main incident link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/incidents.label/i))

      expect(history.location.pathname).toEqual('/incidents')
    })

    it('new incident report link should be active when the current path is /incidents/new', () => {
      const { container } = render('/incidents/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/incidents.reports.new/i)
    })

    it('should navigate to /incidents/new when the new incidents link is clicked', () => {
      render('/incidents')

      userEvent.click(screen.getByText(/incidents.reports.new/i))

      expect(history.location.pathname).toEqual('/incidents/new')
    })

    it('should navigate to /incidents/visualize when the incidents visualize link is clicked', () => {
      render('/incidents')

      userEvent.click(screen.getByText(/incidents.visualize.label/i))

      expect(history.location.pathname).toEqual('/incidents/visualize')
    })

    it('incidents list link should be active when the current path is /incidents', () => {
      const { container } = render('/incidents')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/incidents.reports.label/i)
    })

    it('should navigate to /incidents/new when the incidents list link is clicked', () => {
      render('/incidents/new')

      userEvent.click(screen.getByText(/incidents.reports.label/i))

      expect(history.location.pathname).toEqual('/incidents')
    })
  })

  describe('imagings links', () => {
    it('should render the main imagings link', () => {
      render('/imaging')

      expect(screen.getByText(/imagings.label/i)).toBeInTheDocument()
    })

    it('should render the new imaging request link', () => {
      render('/imagings')

      expect(screen.getByText(/imagings.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new imaging request link when user does not have the request imaging privileges', () => {
      renderNoPermissions('/imagings')

      expect(screen.queryByText(/imagings.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the imagings list link', () => {
      render('/imagings')

      expect(screen.getByText(/imagings.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the imagings list link when user does not have the view imagings privileges', () => {
      renderNoPermissions('/imagings')

      expect(screen.queryByText(/imagings.requests.label/i)).not.toBeInTheDocument()
    })

    it('main imagings link should be active when the current path is /imagings', () => {
      const { container } = render('/imagings')

      expect(container.querySelector('.active')).toHaveTextContent(/imagings.label/i)
    })

    it('should navigate to /imaging when the main imagings link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/imagings.label/i))

      expect(history.location.pathname).toEqual('/imaging')
    })

    it('new imaging request link should be active when the current path is /imagings/new', () => {
      const { container } = render('/imagings/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/imagings.requests.new/i)
    })

    it('should navigate to /imaging/new when the new imaging link is clicked', () => {
      render('/imagings')

      userEvent.click(screen.getByText(/imagings.requests.new/i))

      expect(history.location.pathname).toEqual('/imaging/new')
    })

    it('imagings list link should be active when the current path is /imagings', () => {
      const { container } = render('/imagings')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(/imagings.requests.label/)
    })

    it('should navigate to /imaging when the imagings list link is clicked', () => {
      render('/imagings/new')

      userEvent.click(screen.getByText(/imagings.label/i))

      expect(history.location.pathname).toEqual('/imaging')
    })
  })

  describe('medications links', () => {
    it('should render the main medications link', () => {
      render('/medications')

      expect(screen.getByText(/medications.label/i)).toBeInTheDocument()
    })

    it('should render the new medications request link', () => {
      render('/medications')

      expect(screen.getByText(/medications.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new medications request link when user does not have request medications privileges', () => {
      renderNoPermissions('/medications')

      expect(screen.queryByText(/medications.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the medications list link', () => {
      render('/medications')

      expect(screen.getByText(/medications.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the medications list link when user does not have view medications privileges', () => {
      renderNoPermissions('/medications')

      expect(screen.queryByText(/medications.requests.label/i)).not.toBeInTheDocument()
    })

    it('main medications link should be active when the current path is /medications', () => {
      const { container } = render('/medications')

      expect(container.querySelector('.active')).toHaveTextContent(/medications.label/i)
    })

    it('should navigate to /medications when the main lab link is clicked', () => {
      render('/')

      userEvent.click(screen.getByText(/medications.label/i))

      expect(history.location.pathname).toEqual('/medications')
    })

    it('new lab request link should be active when the current path is /medications/new', () => {
      const { container } = render('/medications/new')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(
        /medications.requests.new/i,
      )
    })

    it('should navigate to /medications/new when the new medications link is clicked', () => {
      render('/medications')

      userEvent.click(screen.getByText(/medications.requests.new/i))
      expect(history.location.pathname).toEqual('/medications/new')
    })

    it('medications list link should be active when the current path is /medications', () => {
      const { container } = render('/medications')

      expect(container.querySelectorAll('.active')[1]).toHaveTextContent(
        /medications.requests.label/i,
      )
    })

    it('should navigate to /medications when the medications list link is clicked', () => {
      render('/medications/new')

      userEvent.click(screen.getByText(/medications.requests.label/i))

      expect(history.location.pathname).toEqual('/medications')
    })
  })
})
