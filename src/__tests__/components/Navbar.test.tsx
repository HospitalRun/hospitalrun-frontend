import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  const history = createMemoryHistory()
  const setup = () =>
    mount(
      <Router history={history}>
        <Navbar />
      </Router>,
    )

  const wrapper = setup()
  const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

  it('should render a HospitalRun Navbar', () => {
    expect(hospitalRunNavbar).toHaveLength(1)
  })

  describe('header', () => {
    const header = wrapper.find('.nav-header')
    it('should render a HospitalRun Navbar with the navbar header', () => {
      expect(header.first().props().children.props.children).toEqual('HospitalRun')
    })
    it('should navigate to / when the header is clicked', () => {
      act(() => {
        header.first().props().onClick()
      })
      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients', () => {
    const patientsLinkList = hospitalRunNavbar.find('.patients-link-list')
    it('should render a patients link list', () => {
      expect(patientsLinkList.first().props().title).toEqual('patients.label')
      expect(patientsLinkList.first().props().children[0].props.children).toEqual('actions.list')
      expect(patientsLinkList.first().props().children[1].props.children).toEqual('actions.new')
    })
    it('should navigate to /patients when the list option is selected', () => {
      act(() => {
        patientsLinkList.first().props().children[0].props.onClick()
      })
      expect(history.location.pathname).toEqual('/patients')
    })
    it('should navigate to /patients/new when the list option is selected', () => {
      act(() => {
        patientsLinkList.first().props().children[1].props.onClick()
      })
      expect(history.location.pathname).toEqual('/patients/new')
    })
  })

  describe('scheduling', () => {
    const scheduleLinkList = hospitalRunNavbar.find('.scheduling-link-list')

    it('should render a scheduling dropdown', () => {
      expect(scheduleLinkList.first().props().title).toEqual('scheduling.label')
      expect(scheduleLinkList.first().props().children[0].props.children).toEqual(
        'scheduling.appointments.label',
      )
      expect(scheduleLinkList.first().props().children[1].props.children).toEqual(
        'scheduling.appointments.new',
      )
    })

    it('should navigate to to /appointments when the appointment list option is selected', () => {
      act(() => {
        scheduleLinkList.first().props().children[0].props.onClick()
      })
      expect(history.location.pathname).toEqual('/appointments')
    })

    it('should navigate to /appointments/new when the new appointment list option is selected', () => {
      act(() => {
        scheduleLinkList.first().props().children[1].props.onClick()
      })
      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })

  describe('labs', () => {
    const labsLinkList = hospitalRunNavbar.find('.labs-link-list')

    it('should render a labs dropdown', () => {
      expect(labsLinkList.first().props().title).toEqual('labs.label')
      expect(labsLinkList.first().props().children[0].props.children).toEqual('labs.label')
      expect(labsLinkList.first().props().children[1].props.children).toEqual('labs.requests.new')
    })

    it('should navigate to to /labs when the labs list option is selected', () => {
      act(() => {
        labsLinkList.first().props().children[0].props.onClick()
      })
      expect(history.location.pathname).toEqual('/labs')
    })

    it('should navigate to /labs/new when the new labs list option is selected', () => {
      act(() => {
        labsLinkList.first().props().children[1].props.onClick()
      })
      expect(history.location.pathname).toEqual('/labs/new')
    })
  })

  describe('search', () => {
    const navSearch = hospitalRunNavbar.find('.nav-search')

    it('should render Search as the search box placeholder', () => {
      expect(navSearch.at(2).props().children.props.children[0].props.placeholder).toEqual(
        'actions.search',
      )
    })

    it('should render Search as the search button label', () => {
      expect(navSearch.at(2).props().children.props.children[1].props.children).toEqual(
        'actions.search',
      )
    })
  })
})
