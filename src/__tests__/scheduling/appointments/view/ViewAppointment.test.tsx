import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Appointment from 'model/Appointment'
import ViewAppointment from 'scheduling/appointments/view/ViewAppointment'
import * as titleUtil from '../../../../page-header/useTitle'
import { Router, Route } from 'react-router'
import { createMemoryHistory } from 'history'

describe('View Appointment', () => {
  describe('header', () => {
    it('should use the correct title', () => {
      jest.spyOn(titleUtil, 'default')
      const history = createMemoryHistory()
      const mockStore = createMockStore([thunk])
      const store = mockStore({
        appointment: {
          appointment: {
            id: '123',
            patientId: 'patient',
          } as Appointment,
          isLoading: false,
        },
      })
      mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="appointments/:id">
              <ViewAppointment />
            </Route>
          </Router>
        </Provider>,
      )

      expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.view.label')
    })
  })

  it('should render a loading spinner', () => {})

  it('should render a AppointmentDetailForm with the correct data', () => {})
})
