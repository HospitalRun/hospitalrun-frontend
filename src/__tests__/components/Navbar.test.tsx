import '../../__mocks__/matchMediaMock'

import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Navbar from '../../components/Navbar'
import Permissions from '../../model/Permissions'
import { RootState } from '../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Navbar', () => {
  const history = createMemoryHistory()

  const setup = (permissions: Permissions[]) => {
    const store = mockStore({
      title: '',
      user: { permissions },
    } as any)

    const wrapper = mount(
      <Router history={history}>
        <Provider store={store}>
          <Navbar />
        </Provider>
      </Router>,
    )
    return wrapper
  }

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
    Permissions.ViewIncidents,
    Permissions.ViewIncident,
    Permissions.ReportIncident,
  ]

  it('should render a HospitalRun Navbar', () => {
    const wrapper = setup(allPermissions)
    const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

    expect(hospitalRunNavbar).toHaveLength(1)
  })

  describe('header', () => {
    it('should render a HospitalRun Navbar with the navbar header', () => {
      const wrapper = setup(allPermissions)
      const header = wrapper.find('.nav-header')
      const { children } = header.first().props() as any

      expect(children.props.children).toEqual('HospitalRun')
    })

    it('should navigate to / when the header is clicked', () => {
      const wrapper = setup(allPermissions)
      const header = wrapper.find('.nav-header')

      act(() => {
        const onClick = header.first().prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients', () => {
    it('should render a patients link list', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const patientsLinkList = hospitalRunNavbar.find('.patients-link-list')
      const { children } = patientsLinkList.first().props() as any

      expect(patientsLinkList.first().props().title).toEqual('patients.label')
      expect(children[0].props.children).toEqual('actions.list')
      expect(children[1].props.children).toEqual('actions.new')
    })

    it('should navigate to /patients when the list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const patientsLinkList = hospitalRunNavbar.find('.patients-link-list')
      const { children } = patientsLinkList.first().props() as any

      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })

    it('should navigate to /patients/new when the list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const patientsLinkList = hospitalRunNavbar.find('.patients-link-list')
      const { children } = patientsLinkList.first().props() as any

      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/patients/new')
    })
  })

  describe('scheduling', () => {
    it('should render a scheduling dropdown', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const scheduleLinkList = hospitalRunNavbar.find('.scheduling-link-list')
      const { children } = scheduleLinkList.first().props() as any

      expect(scheduleLinkList.first().props().title).toEqual('scheduling.label')
      if (scheduleLinkList.first().props().children) {
        expect(children[0].props.children).toEqual('scheduling.appointments.label')
        expect(children[1].props.children).toEqual('scheduling.appointments.new')
      }
    })

    it('should navigate to to /appointments when the appointment list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const scheduleLinkList = hospitalRunNavbar.find('.scheduling-link-list')
      const { children } = scheduleLinkList.first().props() as any

      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })

    it('should navigate to /appointments/new when the new appointment list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const scheduleLinkList = hospitalRunNavbar.find('.scheduling-link-list')
      const { children } = scheduleLinkList.first().props() as any

      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })

  describe('labs', () => {
    it('should render a labs dropdown', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const labsLinkList = hospitalRunNavbar.find('.labs-link-list')
      const { children } = labsLinkList.first().props() as any

      expect(labsLinkList.first().props().title).toEqual('labs.label')
      expect(children[0].props.children).toEqual('labs.label')
      expect(children[1].props.children).toEqual('labs.requests.new')
    })

    it('should navigate to to /labs when the labs list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const labsLinkList = hospitalRunNavbar.find('.labs-link-list')
      const { children } = labsLinkList.first().props() as any

      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/labs')
    })

    it('should navigate to /labs/new when the new labs list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const labsLinkList = hospitalRunNavbar.find('.labs-link-list')
      const { children } = labsLinkList.first().props() as any

      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/labs/new')
    })
  })

  describe('search', () => {
    it('should render Search as the search box placeholder', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const navSearch = hospitalRunNavbar.find('.nav-search')
      const { children } = navSearch.first().props() as any

      expect(children.props.children[0].props.placeholder).toEqual('actions.search')
    })

    it('should render Search as the search button label', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const navSearch = hospitalRunNavbar.find('.nav-search')
      const { children } = navSearch.first().props() as any

      expect(children.props.children[1].props.children).toEqual('actions.search')
    })
  })

  describe('add new', () => {
    it('should show a shortcut if user has a permission', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const addNew = hospitalRunNavbar.find('.add-new')
      const { children } = addNew.first().props() as any

      expect(children[0].props.children).toEqual('patients.newPatient')
    })

    it('should not show a shortcut if user does not have a permission', () => {
      // exclude labs and incidents permissions
      const wrapper = setup(cloneDeep(allPermissions).slice(0, 6))
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const addNew = hospitalRunNavbar.find('.add-new')
      const { children } = addNew.first().props() as any

      children.forEach((option: any) => {
        expect(option.props.children).not.toEqual('labs.requests.new')
        expect(option.props.children).not.toEqual('incidents.requests.new')
      })
    })
  })
})
