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

  describe('hamberger', () => {
    it('should render a hamberger link list', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const hamberger = hospitalRunNavbar.find('.nav-hamberger')
      const { children } = hamberger.first().props() as any

      expect(children[0].props.children).toEqual('dashboard.label')
      expect(children[1].props.children).toEqual('patients.newPatient')
      expect(children[children.length - 1].props.children).toEqual('settings.label')
    })

    it('should not show an item if user does not have a permission', () => {
      // exclude labs and incidents permissions
      const wrapper = setup(cloneDeep(allPermissions).slice(0, 6))
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const hamberger = hospitalRunNavbar.find('.nav-hamberger')
      const { children } = hamberger.first().props() as any

      const labels = [
        'labs.requests.new',
        'labs.requests.label',
        'incidents.reports.new',
        'incidents.reports.label',
      ]

      children.forEach((option: any) => {
        labels.forEach((label) => {
          expect(option.props.children).not.toEqual(label)
        })
      })
    })
  })

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
      const addNew = hospitalRunNavbar.find('.nav-add-new')
      const { children } = addNew.first().props() as any

      expect(children[0].props.children).toEqual('patients.newPatient')
    })

    it('should not show a shortcut if user does not have a permission', () => {
      // exclude labs and incidents permissions
      const wrapper = setup(cloneDeep(allPermissions).slice(0, 6))
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const addNew = hospitalRunNavbar.find('.nav-add-new')
      const { children } = addNew.first().props() as any

      children.forEach((option: any) => {
        expect(option.props.children).not.toEqual('labs.requests.new')
        expect(option.props.children).not.toEqual('incidents.requests.new')
      })
    })
  })

  describe('account', () => {
    it('should render an account link list', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const accountLinkList = hospitalRunNavbar.find('.nav-account')
      const { children } = accountLinkList.first().props() as any

      expect(children[0].props.children).toEqual('settings.label')
    })

    it('should navigate to /settings when the list option is selected', () => {
      const wrapper = setup(allPermissions)
      const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)
      const accountLinkList = hospitalRunNavbar.find('.nav-account')
      const { children } = accountLinkList.first().props() as any

      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/settings')
    })
  })
})
