import { render, waitFor, screen } from '@testing-library/react'
import addMinutes from 'date-fns/addMinutes'
import format from 'date-fns/format'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import ViewAppointments from '../../../scheduling/appointments/ViewAppointments'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil

const now = new Date()

const setup = (start = new Date(now.setHours(14, 30))) => {
  const expectedAppointment = {
    id: '123',
    rev: '1',
    patient: '1234',
    startDateTime: start.toISOString(),
    endDateTime: addMinutes(start, 60).toISOString(),
    location: 'location',
    reason: 'reason',
  } as Appointment
  const expectedPatient = {
    id: '123',
    fullName: 'patient full name',
  } as Patient

  jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockImplementation(() => jest.fn())
  jest.spyOn(AppointmentRepository, 'findAll').mockResolvedValue([expectedAppointment])
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)

  const mockStore = createMockStore<RootState, any>([thunk])

  return {
    expectedPatient,
    expectedAppointment,
    ...render(
      <Provider store={mockStore({ appointments: { appointments: [expectedAppointment] } } as any)}>
        <MemoryRouter initialEntries={['/appointments']}>
          <TitleProvider>
            <ViewAppointments />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    ),
  }
}

describe('ViewAppointments', () => {
  it('should add a "New Appointment" button to the button tool bar', async () => {
    setup()

    await waitFor(() => {
      expect(ButtonBarProvider.useButtonToolbarSetter).toHaveBeenCalled()
    })
  })

  it('should render a calendar with the proper events', async () => {
    const { expectedPatient, expectedAppointment } = setup()

    await waitFor(() => {
      expect(screen.getAllByText(expectedPatient.fullName as string)[0]).toBeInTheDocument()
    })

    const expectedStart = format(new Date(expectedAppointment.startDateTime), 'h:mm')
    const expectedEnd = format(new Date(expectedAppointment.endDateTime), 'h:mm')

    expect(screen.getByText(`${expectedStart} - ${expectedEnd}`)).toBeInTheDocument()
  })
})
