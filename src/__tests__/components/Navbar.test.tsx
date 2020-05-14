import '../../__mocks__/matchMediaMock'

import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

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
    const { children } = header.first().props() as any

    it('should render a HospitalRun Navbar with the navbar header', () => {
      expect(children.props.children).toEqual('HospitalRun')
    })
    it('should navigate to / when the header is clicked', () => {
      act(() => {
        const onClick = header.first().prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients', () => {
    const patientsLinkList = hospitalRunNavbar.find('.patients-link-list')
    const { children } = patientsLinkList.first().props() as any

    it('should render a patients link list', () => {
      expect(patientsLinkList.first().props().title).toEqual('patients.label')
      expect(children[0].props.children).toEqual('actions.list')
      expect(children[1].props.children).toEqual('actions.new')
    })
    it('should navigate to /patients when the list option is selected', () => {
      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })
    it('should navigate to /patients/new when the list option is selected', () => {
      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/patients/new')
    })
  })

  describe('scheduling', () => {
    const scheduleLinkList = hospitalRunNavbar.find('.scheduling-link-list')

    it('should render a scheduling dropdown', () => {
      expect(scheduleLinkList.first().props().title).toEqual('scheduling.label')

      const children = scheduleLinkList.first().props().children as any[]
      const firstChild = children[0] as any
      const secondChild = children[1] as any

      if (scheduleLinkList.first().props().children) {
        expect(firstChild.props.children).toEqual('scheduling.appointments.label')
        expect(secondChild.props.children).toEqual('scheduling.appointments.new')
      }
    })

    it('should navigate to to /appointments when the appointment list option is selected', () => {
      const children = scheduleLinkList.first().props().children as any[]

      act(() => {
        children[0].props.onClick()
      })
      expect(history.location.pathname).toEqual('/appointments')
    })

    it('should navigate to /appointments/new when the new appointment list option is selected', () => {
      const children = scheduleLinkList.first().props().children as any[]

      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })

  describe('labs', () => {
    const labsLinkList = hospitalRunNavbar.find('.labs-link-list')
    const { children } = labsLinkList.first().props() as any

    it('should render a labs dropdown', () => {
      expect(labsLinkList.first().props().title).toEqual('labs.label')
      expect(children[0].props.children).toEqual('labs.label')
      expect(children[1].props.children).toEqual('labs.requests.new')
    })

    it('should navigate to to /labs when the labs list option is selected', () => {
      act(() => {
        children[0].props.onClick()
      })

      expect(history.location.pathname).toEqual('/labs')
    })

    it('should navigate to /labs/new when the new labs list option is selected', () => {
      act(() => {
        children[1].props.onClick()
      })

      expect(history.location.pathname).toEqual('/labs/new')
    })
  })

  describe('search', () => {
    const navSearch = hospitalRunNavbar.find('.nav-search')
    const { children } = navSearch.first().props() as any

    it('should render Search as the search box placeholder', () => {
      expect(children.props.children[0].props.placeholder).toEqual('actions.search')
    })

    it('should render Search as the search button label', () => {
      expect(children.props.children[1].props.children).toEqual('actions.search')
    })
  })
})
