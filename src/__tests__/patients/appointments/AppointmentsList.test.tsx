import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Patient from 'model/Patient'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import AppointmentsList from 'patients/appointments/AppointmentsList'
import * as components from '@hospitalrun/components'
import { act } from 'react-dom/test-utils'
// import PatientRepository from 'clients/db/PatientRepository' # Lint warning: 'PatientRepository' is defined but never used

const expectedPatient = {
  id: '123',
} as Patient
const expectedAppointments = [
  {
    id: '123',
    rev: '1',
    patientId: '1234',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    location: 'location',
    reason: 'reason',
  },
]

const mockStore = configureMockStore([thunk])
const history = createMemoryHistory()

let store: any

const setup = (patient = expectedPatient, appointments = expectedAppointments) => {
  store = mockStore({ patient, appointments: { appointments } })
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
  describe('add new appointment button', () => {
    it('should render a new appointment button', () => {
      const wrapper = setup()

      const addNewAppointmentButton = wrapper.find(components.Button).at(0)
      expect(addNewAppointmentButton).toHaveLength(1)
      expect(addNewAppointmentButton.text().trim()).toEqual('scheduling.appointments.new')
    })

    it('should navigate to new appointment page', () => {
      const wrapper = setup()

      act(() => {
        wrapper.find(components.Button).at(0).prop('onClick')()
      })
      wrapper.update()

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })
})
