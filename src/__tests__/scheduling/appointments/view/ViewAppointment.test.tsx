import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import Appointment from 'model/Appointment'
import ViewAppointment from 'scheduling/appointments/view/ViewAppointment'
import { Router, Route } from 'react-router'
import { createMemoryHistory } from 'history'
import AppointmentRepository from 'clients/db/AppointmentRepository'
import { mocked } from 'ts-jest/utils'
import { act } from 'react-dom/test-utils'
import { Spinner } from '@hospitalrun/components'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import * as ButtonBarProvider from 'page-header/ButtonBarProvider'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'

const mockStore = configureMockStore([thunk])

const appointment = {
  id: '123',
  startDateTime: new Date().toISOString(),
  endDateTime: new Date().toISOString(),
  reason: 'reason',
  location: 'location',
} as Appointment

const patient = {
  id: '123',
  fullName: 'full name',
} as Patient

describe('View Appointment', () => {
  let history: any
  let store: MockStore

  const setup = (isLoading: boolean) => {
    jest.spyOn(AppointmentRepository, 'find')
    const mockedAppointmentRepository = mocked(AppointmentRepository, true)
    mockedAppointmentRepository.find.mockResolvedValue(appointment)

    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)

    history = createMemoryHistory()
    history.push('/appointments/123')

    store = mockStore({
      appointment: {
        appointment,
        isLoading,
        patient,
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
    jest.restoreAllMocks()
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup(true)
    })

    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.viewAppointment')
  })

  it('should add a "Edit Appointment" button to the button tool bar', () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    setup(true)

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual('actions.edit')
  })

  it('should dispatch getAppointment if id is present', async () => {
    await act(async () => {
      await setup(true)
    })

    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)
    expect(store.getActions()).toContainEqual(appointmentSlice.fetchAppointmentStart())
    expect(store.getActions()).toContainEqual(
      appointmentSlice.fetchAppointmentSuccess({ appointment, patient }),
    )
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
