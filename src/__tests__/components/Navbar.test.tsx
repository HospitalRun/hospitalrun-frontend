import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import Navbar from '../../components/Navbar'
import Patients from '../../patients/list/Patients'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'

describe('Navbar', () => {
    const history = createMemoryHistory();
    const setup = () => {
        return mount(<Router history={history}><Navbar /></Router>)
    }


    it('should render a HospitalRun Navbar', () => {
        const wrapper = setup()
        expect(wrapper.find(HospitalRunNavbar)).toHaveLength(1)
    })

    it('should render a HospitalRun Navbar with the navbar brand', () => {
        const wrapper = setup()

        expect(wrapper.find(HospitalRunNavbar).prop('brand').label).toEqual('HospitalRun')
    })

    it('should render a patients dropdown', () => {
        const wrapper = setup()

        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        expect(hospitalRunNavbar.prop('navLinks')[0].label).toEqual('patients.label')
        expect(hospitalRunNavbar.prop('navLinks')[0].children[0].label).toEqual('actions.list')
        expect(hospitalRunNavbar.prop('navLinks')[0].children[1].label).toEqual('actions.new')
    })

    it('should navigate to / when the brand is clicked', () => {
        const wrapper = setup()
        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        act(() => {
            (hospitalRunNavbar.prop('brand') as any).onClick()
        })

        expect(history.location.pathname).toEqual('/')
    })

    it('should navigate to /patients when the list option is selected', () => {
        const wrapper = setup()
        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        act(() => {
            (hospitalRunNavbar.prop('navLinks')[0].children[0] as any).onClick()
        })

        expect(history.location.pathname).toEqual('/patients')
    })

    it('should navigate to /patients/new when the list option is selected', () => {
        const wrapper = setup()
        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        act(() => {
            (hospitalRunNavbar.prop('navLinks')[0].children[1] as any).onClick()
        })

        expect(history.location.pathname).toEqual('/patients/new')
    })

    it('should render Search as the search button label', () => {
        const wrapper = setup()
        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        expect(hospitalRunNavbar.prop('search').buttonText).toEqual('actions.search')
    })

    it('should render Search as the search box placeholder', () => {
        const wrapper = setup()
        const hospitalRunNavbar = wrapper.find(HospitalRunNavbar)

        expect(hospitalRunNavbar.prop('search').placeholderText).toEqual('actions.search')
    })
})