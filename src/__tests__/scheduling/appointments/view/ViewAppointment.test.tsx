import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Appointment from 'model/Appointment'
import ViewAppointment from 'scheduling/appointments/view/ViewAppointment'
import { Router, Route } from 'react-router'
import { createMemoryHistory } from 'history'
import AppointmentRepository from 'clients/db/AppointmentsRepository'
import { mocked } from 'ts-jest/utils'
import { act } from 'react-dom/test-utils'
import { Spinner } from '@hospitalrun/components'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import * as titleUtil from '../../../../page-header/useTitle'

const appointment = {
  id: '123',
  startDateTime: new Date().toISOString(),
  endDateTime: new Date().toISOString(),
  reason: 'reason',
  location: 'location',
} as Appointment

describe('View Appointment', () => {
  const setup = (isLoading: boolean) => {
    jest.spyOn(AppointmentRepository, 'find')
    const mockedAppointmentRepository = mocked(AppointmentRepository, true)
    mockedAppointmentRepository.find.mockResolvedValue(appointment)
    jest.mock('react-router-dom', () => ({
      useParams: () => ({
        id: '123',
      }),
    }))

    const history = createMemoryHistory()
    history.push('/appointments/123')

    const mockStore = createMockStore([thunk])
    const store = mockStore({
      appointment: {
        appointment,
        isLoading,
      },
    })

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/:id">
            <ViewAppointment />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup(true)
    })

    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.view')
  })

  it('should call the fetch appointment function if id is present', async () => {
    await act(async () => {
      await setup(true)
    })
  })

  it('should render a loading spinner', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup(true)
    })

    expect(wrapper.find(Spinner)).toHaveLength(1)
  })

  it('should render a AppointmentDetailForm with the correct data', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup(false)
    })

    const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
    expect(appointmentDetailForm.prop('appointment')).toEqual(appointment)
    expect(appointmentDetailForm.prop('isEditable')).toBeFalsy()
  })
})
