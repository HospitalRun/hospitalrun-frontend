import '../../../__mocks__/matchMediaMock'

import * as components from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import Appointment from '../../../model/Appointment'
import Patient from '../../../model/Patient'
import AppointmentsList from '../../../patients/appointments/AppointmentsList'
import { RootState } from '../../../store'

const expectedPatient = {
  id: '123',
} as Patient

const expectedAppointments = [
  {
    id: '456',
    rev: '1',
    patient: '1234',
    startDateTime: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    endDateTime: new Date(2020, 1, 1, 9, 30, 0, 0).toISOString(),
    location: 'location',
    reason: 'Follow Up',
  },
  {
    id: '123',
    rev: '1',
    patient: '1234',
    startDateTime: new Date(2020, 1, 1, 8, 0, 0, 0).toISOString(),
    endDateTime: new Date(2020, 1, 1, 8, 30, 0, 0).toISOString(),
    location: 'location',
    reason: 'Checkup',
  },
] as Appointment[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = (patient = expectedPatient, appointments = expectedAppointments) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue(appointments)
  store = mockStore({ patient, appointments: { appointments } } as any)
  const wrapper = mount(
    <Router history={history}>
      <Provider store={store}>
        <AppointmentsList patientId={patient.id} />
      </Provider>
    </Router>,
  )
  return wrapper
}

describe('AppointmentsList', () => {
  it('should render a list of appointments', () => {
    const wrapper = setup()
    const listItems: ReactWrapper = wrapper.find(components.ListItem)

    expect(listItems.length === 2).toBeTruthy()
    expect(listItems.at(0).text()).toEqual(
      new Date(expectedAppointments[0].startDateTime).toLocaleString(),
    )
    expect(listItems.at(1).text()).toEqual(
      new Date(expectedAppointments[1].startDateTime).toLocaleString(),
    )
  })

  describe('New appointment button', () => {
    it('should render a new appointment button', () => {
      const wrapper = setup()

      const addNewAppointmentButton = wrapper.find(components.Button).at(0)
      expect(addNewAppointmentButton).toHaveLength(1)
      expect(addNewAppointmentButton.text().trim()).toEqual('scheduling.appointments.new')
    })

    it('should navigate to new appointment page', async () => {
      const wrapper = setup()

      await act(async () => {
        await wrapper.find(components.Button).at(0).simulate('click')
      })
      wrapper.update()

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })
})
