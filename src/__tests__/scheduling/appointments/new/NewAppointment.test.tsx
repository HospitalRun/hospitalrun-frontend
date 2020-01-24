import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import { MemoryRouter } from 'react-router'
import store from 'store'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import * as titleUtil from '../../../../page-header/useTitle'

describe('New Appointment', () => {
  it('should use "New Appointment" as the header', () => {
    jest.spyOn(titleUtil, 'default')
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewAppointment />
        </MemoryRouter>
      </Provider>,
    )

    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.new')
  })
})
