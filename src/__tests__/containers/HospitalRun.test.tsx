import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import HospitalRun from '../../containers/HospitalRun'
import NewPatient from '../../patients/new/NewPatient'
import store from '../../store'

describe('HospitalRun', () => {
  describe('routing', () => {
    it('should render the new patient screen when /patients/new is accessed', () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/patients/new']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )

      expect(wrapper.find(NewPatient)).toHaveLength(1)
    })
  })
})
