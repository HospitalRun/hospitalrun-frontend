import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import HospitalRun from '../../containers/HospitalRun'
import Dashboard from '../../containers/Dashboard'
import { Provider } from 'react-redux'
import store from '../../store'
import NewPatient from "../../patients/new/NewPatient";

describe('HospitalRun', () => {
  describe('routing', () => {
    it('should render the new patient when the /patients/new route is used', () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/patients/new']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )

      expect(wrapper.find(NewPatient)).toHaveLength(1)
    })

    it('should render the dashboard when the / route is used', () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )

      expect(wrapper.find(Dashboard)).toHaveLength(1)
    })
  })
})
