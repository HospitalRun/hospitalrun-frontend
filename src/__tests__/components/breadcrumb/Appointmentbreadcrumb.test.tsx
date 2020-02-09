import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { BreadcrumbItem as HrBreadcrumbItem } from '@hospitalrun/components'
import AppointmentBreadcrumb from 'components/breadcrumb/AppointmentBreadcrumb'

const mockStore = configureMockStore()

describe('Breadcrumb', () => {
  const history = createMemoryHistory()
  history.push('/appointments/1234')
  const wrapper = mount(
    <Provider
      store={mockStore({
        appointment: { appointment: {} },
      })}
    >
      <Router history={history}>
        <AppointmentBreadcrumb />
      </Router>
    </Provider>,
  )

  it('should render 2 breadcrumb items', () => {
    expect(wrapper.find(HrBreadcrumbItem)).toHaveLength(2)
  })
})
