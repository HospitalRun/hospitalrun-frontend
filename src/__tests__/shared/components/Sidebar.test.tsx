import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
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
  const allPermissions = Object.values(Permissions)
  const store = mockStore({
    components: { sidebarCollapsed: false },
    user: { permissions: allPermissions },
  } as any)

  const setup = (location: string, permissions = true) => {
    history = createMemoryHistory()
    history.push(location)
    return render(
      <Router history={history}>
        <Provider
          store={
            permissions
              ? store
              : mockStore({
                  components: { sidebarCollapsed: false },
                  user: { permissions: [] },
                } as any)
          }
        >
          <Sidebar />
        </Provider>
      </Router>,
    )
  }

  describe('dashboard links', () => {
    it('should render the dashboard link', () => {
      setup('/')

      expect(screen.getByText(/dashboard.label/i)).toBeInTheDocument()
    })

    it('should be active when the current path is /', () => {
      setup('/')
      expect(screen.getByText(/dashboard\.label/i)).toHaveClass('active')
    })

    it('should navigate to / when the dashboard link is clicked', () => {
      setup('/patients')

      userEvent.click(screen.getByText(/dashboard.label/i))

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients links', () => {
    it('should render the patients main link', () => {
      setup('/')

      expect(screen.getByText(/patients.label/i)).toBeInTheDocument()
    })

    it('should render the new_patient link', () => {
      setup('/patients')

      expect(screen.getByText(/patients.newPatient/i)).toBeInTheDocument()
    })

    it('should not render the new_patient link when the user does not have write patient privileges', () => {
      setup('/patients', false)

      expect(screen.queryByText(/patients.newPatient/i)).not.toBeInTheDocument()
    })

    it('should render the patients_list link', () => {
      setup('/patients')

      expect(screen.getByText(/patients.patientsList/i)).toBeInTheDocument()
    })

    it('should not render the patients_list link when the user does not have read patient privileges', () => {
      setup('/patients', false)

      expect(screen.queryByText(/patients.patientsList/i)).not.toBeInTheDocument()
    })

    it('main patients link should be active when the current path is /patients', () => {
      setup('/patients')

      expect(screen.getByText(/patients\.label/i)).toHaveClass('active')
    })

    it('should navigate to /patients when the patients main link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/patients.label/i))

      expect(history.location.pathname).toEqual('/patients')
    })

    it('new patient should be active when the current path is /patients/new', () => {
      setup('/patients/new')

      expect(screen.getByText(/patients\.newPatient/i)).toHaveClass('active')
    })

    it('should navigate to /patients/new when the patients new link is clicked', () => {
      setup('/patients')
      userEvent.click(screen.getByText(/patients.newPatient/i))

      expect(history.location.pathname).toEqual('/patients/new')
    })

    it('patients list link should be active when the current path is /patients', () => {
      setup('/patients')

      expect(screen.getByText(/patients\.patientsList/i)).toHaveClass('active')
    })

    it('should navigate to /patients when the patients list link is clicked', () => {
      setup('/patients')

      userEvent.click(screen.getByText(/patients.patientsList/i))
      expect(history.location.pathname).toEqual('/patients')
    })
  })

  describe('appointments link', () => {
    it('should render the scheduling link', () => {
      setup('/appointments')

      expect(screen.getByText(/scheduling.label/i)).toBeInTheDocument()
    })

    it('should render the new appointment link', () => {
      setup('/appointments/new')

      expect(screen.getByText(/scheduling.appointments.new/i)).toBeInTheDocument()
    })

    it('should not render the new appointment link when the user does not have write appointments privileges', () => {
      setup('/appointments', false)

      expect(screen.queryByText(/scheduling.appointments.new/i)).not.toBeInTheDocument()
    })

    it('should render the appointments schedule link', () => {
      setup('/appointments')

      expect(screen.getByText(/scheduling.appointments.schedule/i)).toBeInTheDocument()
    })

    it('should not render the appointments schedule link when the user does not have read appointments privileges', () => {
      setup('/appointments', false)

      expect(screen.queryByText(/scheduling.appointments.schedule/i)).not.toBeInTheDocument()
    })

    it('main scheduling link should be active when the current path is /appointments', () => {
      setup('/appointments')

      expect(screen.getByText(/scheduling\.label/i)).toHaveClass('active')
    })

    it('should navigate to /appointments when the main scheduling link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/scheduling.label/i))

      expect(history.location.pathname).toEqual('/appointments')
    })

    it('new appointment link should be active when the current path is /appointments/new', () => {
      setup('/appointments/new')

      expect(screen.getByText(/appointments\.new/i)).toHaveClass('active')
    })

    it('should navigate to /appointments/new when the new appointment link is clicked', () => {
      setup('/appointments')
      userEvent.click(screen.getByText(/scheduling.appointments.new/i))

      expect(history.location.pathname).toEqual('/appointments/new')
    })

    it('appointments schedule link should be active when the current path is /appointments', () => {
      setup('/appointments')

      expect(screen.getByText(/scheduling\.appointments\.schedule/i)).toHaveClass('active')
    })

    it('should navigate to /appointments when the appointments schedule link is clicked', () => {
      setup('/appointments')

      userEvent.click(screen.getByText(/scheduling.appointments.schedule/i))

      expect(history.location.pathname).toEqual('/appointments')
    })
  })

  describe('labs links', () => {
    it('should render the main labs link', () => {
      setup('/labs')

      expect(screen.getByText(/labs.label/i)).toBeInTheDocument()
    })

    it('should render the new labs request link', () => {
      setup('/labs')

      expect(screen.getByText(/labs.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new labs request link when user does not have request labs privileges', () => {
      setup('/labs', false)

      expect(screen.queryByText(/labs.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the labs list link', () => {
      setup('/labs')

      expect(screen.getByText(/labs.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the labs list link when user does not have view labs privileges', () => {
      setup('/labs', false)

      expect(screen.queryByText(/labs.requests.label/i)).not.toBeInTheDocument()
    })

    it('main labs link should be active when the current path is /labs', () => {
      setup('/labs')

      expect(screen.getByText(/labs\.label/i)).toHaveClass('active')
    })

    it('should navigate to /labs when the main lab link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/labs.label/i))

      expect(history.location.pathname).toEqual('/labs')
    })

    it('new lab request link should be active when the current path is /labs/new', () => {
      setup('/labs/new')

      expect(screen.getByText(/labs\.requests\.new/i)).toHaveClass('active')
    })

    it('should navigate to /labs/new when the new labs link is clicked', () => {
      setup('/labs')

      userEvent.click(screen.getByText(/labs.requests.new/))

      expect(history.location.pathname).toEqual('/labs/new')
    })

    it('labs list link should be active when the current path is /labs', () => {
      setup('/labs')

      expect(screen.getByText(/labs\.requests\.label/i)).toHaveClass('active')
    })

    it('should navigate to /labs when the labs list link is clicked', () => {
      setup('/labs')

      userEvent.click(screen.getByText(/labs.label/i))

      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('incident links', () => {
    it('should render the main incidents link', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents.label/i)).toBeInTheDocument()
    })

    it('should render the new incident report link', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents.reports.new/i)).toBeInTheDocument()
    })

    it('should be the last one in the sidebar', () => {
      setup('/incidents')
      expect(screen.getAllByText(/label/i)[5]).toHaveTextContent(/imagings.label/i)
      expect(screen.getAllByText(/label/i)[6]).toHaveTextContent(/incidents.label/i)
    })

    it('should not render the new incident report link when user does not have the report incidents privileges', () => {
      setup('/incidents', false)

      expect(screen.queryByText(/incidents.reports.new/i)).not.toBeInTheDocument()
    })

    it('should render the incidents list link', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents.reports.label/i)).toBeInTheDocument()
    })

    it('should not render the incidents list link when user does not have the view incidents privileges', () => {
      setup('/incidents', false)

      expect(screen.queryByText(/incidents.reports.label/i)).not.toBeInTheDocument()
    })

    it('should render the incidents visualize link', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents.visualize.label/i)).toBeInTheDocument()
    })

    it('should not render the incidents visualize link when user does not have the view incident widgets privileges', () => {
      setup('/incidents', false)

      expect(screen.queryByText(/incidents.visualize.label/i)).not.toBeInTheDocument()
    })

    it('main incidents link should be active when the current path is /incidents', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents\.labe/i)).toHaveClass('active')
    })

    it('should navigate to /incidents when the main incident link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/incidents.label/i))

      expect(history.location.pathname).toEqual('/incidents')
    })

    it('new incident report link should be active when the current path is /incidents/new', () => {
      setup('/incidents/new')

      expect(screen.getByText(/incidents\.reports\.new/i)).toHaveClass('active')
    })

    it('should navigate to /incidents/new when the new incidents link is clicked', () => {
      setup('/incidents')

      userEvent.click(screen.getByText(/incidents.reports.new/i))

      expect(history.location.pathname).toEqual('/incidents/new')
    })

    it('should navigate to /incidents/visualize when the incidents visualize link is clicked', () => {
      setup('/incidents')

      userEvent.click(screen.getByText(/incidents.visualize.label/i))

      expect(history.location.pathname).toEqual('/incidents/visualize')
    })

    it('incidents list link should be active when the current path is /incidents', () => {
      setup('/incidents')

      expect(screen.getByText(/incidents\.reports\.label/i)).toHaveClass('active')
    })

    it('should navigate to /incidents/new when the incidents list link is clicked', () => {
      setup('/incidents/new')

      userEvent.click(screen.getByText(/incidents.reports.label/i))

      expect(history.location.pathname).toEqual('/incidents')
    })
  })

  describe('imagings links', () => {
    it('should render the main imagings link', () => {
      setup('/imaging')

      expect(screen.getByText(/imagings.label/i)).toBeInTheDocument()
    })

    it('should render the new imaging request link', () => {
      setup('/imagings')

      expect(screen.getByText(/imagings.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new imaging request link when user does not have the request imaging privileges', () => {
      setup('/imagings', false)

      expect(screen.queryByText(/imagings.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the imagings list link', () => {
      setup('/imagings')

      expect(screen.getByText(/imagings.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the imagings list link when user does not have the view imagings privileges', () => {
      setup('/imagings', false)

      expect(screen.queryByText(/imagings.requests.label/i)).not.toBeInTheDocument()
    })

    it('main imagings link should be active when the current path is /imagings', () => {
      setup('/imagings')

      expect(screen.getByText(/imagings\.label/i)).toHaveClass('active')
    })

    it('should navigate to /imaging when the main imagings link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/imagings.label/i))

      expect(history.location.pathname).toEqual('/imaging')
    })

    it('new imaging request link should be active when the current path is /imagings/new', () => {
      setup('/imagings/new')

      expect(screen.getByText(/imagings\.requests\.new/i)).toHaveClass('active')
    })

    it('should navigate to /imaging/new when the new imaging link is clicked', () => {
      setup('/imagings')

      userEvent.click(screen.getByText(/imagings.requests.new/i))

      expect(history.location.pathname).toEqual('/imaging/new')
    })

    it('imagings list link should be active when the current path is /imagings', () => {
      setup('/imagings')

      expect(screen.getByText(/imagings\.requests\.label/i)).toHaveClass('active')
    })

    it('should navigate to /imaging when the imagings list link is clicked', () => {
      setup('/imagings/new')

      userEvent.click(screen.getByText(/imagings.label/i))

      expect(history.location.pathname).toEqual('/imaging')
    })
  })

  describe('medications links', () => {
    it('should render the main medications link', () => {
      setup('/medications')

      expect(screen.getByText(/medications.label/i)).toBeInTheDocument()
    })

    it('should render the new medications request link', () => {
      setup('/medications')

      expect(screen.getByText(/medications.requests.new/i)).toBeInTheDocument()
    })

    it('should not render the new medications request link when user does not have request medications privileges', () => {
      setup('/medications', false)

      expect(screen.queryByText(/medications.requests.new/i)).not.toBeInTheDocument()
    })

    it('should render the medications list link', () => {
      setup('/medications')

      expect(screen.getByText(/medications.requests.label/i)).toBeInTheDocument()
    })

    it('should not render the medications list link when user does not have view medications privileges', () => {
      setup('/medications', false)

      expect(screen.queryByText(/medications.requests.label/i)).not.toBeInTheDocument()
    })

    it('main medications link should be active when the current path is /medications', () => {
      setup('/medications')

      expect(screen.getByText(/medications\.label/i)).toHaveClass('active')
    })

    it('should navigate to /medications when the main lab link is clicked', () => {
      setup('/')

      userEvent.click(screen.getByText(/medications.label/i))

      expect(history.location.pathname).toEqual('/medications')
    })

    it('new lab request link should be active when the current path is /medications/new', () => {
      setup('/medications/new')

      expect(screen.getByText(/medications\.requests\.new/i)).toHaveClass('active')
    })

    it('should navigate to /medications/new when the new medications link is clicked', () => {
      setup('/medications')

      userEvent.click(screen.getByText(/medications.requests.new/i))
      expect(history.location.pathname).toEqual('/medications/new')
    })

    it('medications list link should be active when the current path is /medications', () => {
      setup('/medications')

      expect(screen.getByText(/medications\.requests\.label/i)).toHaveClass('active')
    })

    it('should navigate to /medications when the medications list link is clicked', () => {
      setup('/medications/new')

      userEvent.click(screen.getByText(/medications.requests.label/i))

      expect(history.location.pathname).toEqual('/medications')
    })
  })
})
