import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import DefaultBreadcrumb from 'components/breadcrumb/DefaultBreadcrumb'
import PatientBreadcrumb from 'components/breadcrumb/PatientBreadcrumb'
import AppointmentBreadcrumb from 'components/breadcrumb/AppointmentBreadcrumb'
import Breadcrumb from 'components/breadcrumb/Breadcrumb'

const mockStore = configureMockStore()

describe('Breadcrumb', () => {
  const setup = (location: string) => {
    const history = createMemoryHistory()
    history.push(location)
    return mount(
      <Provider
        store={mockStore({
          patient: { patient: {} },
          appointment: { appointment: {} },
        })}
      >
        <Router history={history}>
          <Breadcrumb />
        </Router>
      </Provider>,
    )
  }
  it('should render the patient breadcrumb when /patients/:id is accessed', () => {
    const wrapper = setup('/patients/1234')
    expect(wrapper.find(PatientBreadcrumb)).toHaveLength(1)
  })
  it('should render the appointment breadcrumb when /appointments/:id is accessed', () => {
    const wrapper = setup('/appointments/1234')
    expect(wrapper.find(AppointmentBreadcrumb)).toHaveLength(1)
  })

  it('should render the default breadcrumb when /patients/new is accessed', () => {
    const wrapper = setup('/patients/new')
    expect(wrapper.find(DefaultBreadcrumb)).toHaveLength(1)
  })

  it('should render the default breadcrumb when /appointments/new is accessed', () => {
    const wrapper = setup('/appointments/new')
    expect(wrapper.find(DefaultBreadcrumb)).toHaveLength(1)
  })

  it('should render the default breadcrumb when any other path is accessed', () => {
    let wrapper = setup('/appointments')
    expect(wrapper.find(DefaultBreadcrumb)).toHaveLength(1)

    wrapper = setup('/patients')
    expect(wrapper.find(DefaultBreadcrumb)).toHaveLength(1)

    wrapper = setup('/')
    expect(wrapper.find(DefaultBreadcrumb)).toHaveLength(1)
  })
})
