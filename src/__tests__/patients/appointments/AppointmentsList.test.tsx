import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AppointmentsList from '../../../patients/appointments/AppointmentsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

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

const setup = (patient = expectedPatient, appointments = expectedAppointments) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue(appointments)
  const store = mockStore({ patient, appointments: { appointments } } as any)
  const history = createMemoryHistory()

  return {
    history,
    ...render(
      <Router history={history}>
        <Provider store={store}>
          <AppointmentsList patient={patient} />
        </Provider>
      </Router>,
    ),
  }
}

describe('AppointmentsList', () => {
  describe('Table', () => {
    it('should render a list of appointments', async () => {
      setup()
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      })
      const header = screen.getAllByRole('columnheader')

      expect(header[0]).toHaveTextContent(/scheduling.appointment.startDate/i)
      expect(header[1]).toHaveTextContent(/scheduling.appointment.endDate/i)
      expect(header[2]).toHaveTextContent(/scheduling.appointment.location/i)
      expect(header[3]).toHaveTextContent(/scheduling.appointment.type/i)
      expect(header[4]).toHaveTextContent(/actions.label/i)
      expect(screen.getAllByRole('button', { name: /actions.view/i })[0]).toBeInTheDocument()
    })

    it('should navigate to appointment profile on appointment click', async () => {
      const { history } = setup()

      userEvent.click((await screen.findAllByRole('button', { name: /actions.view/i }))[0])

      await waitFor(() => {
        expect(history.location.pathname).toEqual('/appointments/456')
      })
    })
  })

  describe('Empty list', () => {
    it('should render a warning message if there are no appointments', async () => {
      setup(expectedPatient, [])

      const alert = await screen.findByRole('alert')

      expect(alert).toBeInTheDocument()
      expect(screen.getByText(/patient.appointments.warning.noAppointments/i)).toBeInTheDocument()
      expect(screen.getByText(/patient.appointments.addAppointmentAbove/i)).toBeInTheDocument()
    })
  })

  describe('New appointment button', () => {
    it('should render a new appointment button if there is an appointment', async () => {
      setup()

      expect(
        await screen.findByRole('button', { name: /scheduling.appointments.new/i }),
      ).toBeInTheDocument()
    })

    it('should render a new appointment button if there are no appointments', async () => {
      setup(expectedPatient, [])

      expect(
        await screen.findByRole('button', { name: /scheduling.appointments.new/i }),
      ).toBeInTheDocument()
    })

    it('should navigate to new appointment page', async () => {
      const { history } = setup()

      userEvent.click(await screen.findByRole('button', { name: /scheduling.appointments.new/i }))

      await waitFor(() => {
        expect(history.location.pathname).toEqual('/appointments/new')
      })
    })
  })
})
