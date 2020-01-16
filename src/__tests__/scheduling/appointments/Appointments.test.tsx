import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as titleUtil from '../../../page-header/useTitle'
import Appointments from 'scheduling/appointments/Appointments'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Calendar } from '@hospitalrun/components'

describe('Appointments', () => {
  const setup = () => {
    const mockStore = createMockStore([thunk])
    return mount(
      <Provider store={mockStore({})}>
        <MemoryRouter initialEntries={['/appointments']}>
          <Appointments />
        </MemoryRouter>
      </Provider>,
    )
  }

  it('should use "Appointments" as the header', () => {
    jest.spyOn(titleUtil, 'default')
    setup()
    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.label')
  })

  it('should render a calendar', () => {
    const wrapper = setup()
    expect(wrapper.find(Calendar)).toHaveLength(1)
  })
})
