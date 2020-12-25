import { act, render as rtlRender, waitFor, screen } from '@testing-library/react'
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

const expectedAppointments = [
  {
    id: '123',
    rev: '1',
    patient: '1234',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    location: 'location',
    reason: 'reason',
  },
] as Appointment[]
const expectedPatient = {
  id: '123',
  fullName: 'patient full name',
} as Patient

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ViewAppointments', () => {
  const render = () => {
    jest.spyOn(titleUtil, 'useUpdateTitle').mockReturnValue(jest.fn())
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockImplementation(() => jest.fn())
    jest.spyOn(AppointmentRepository, 'findAll').mockResolvedValue(expectedAppointments)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)

    const mockStore = createMockStore<RootState, any>([thunk])

    return rtlRender(
      <Provider store={mockStore({ appointments: { appointments: expectedAppointments } } as any)}>
        <MemoryRouter initialEntries={['/appointments']}>
          <TitleProvider>
            <ViewAppointments />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  it('should have called the useUpdateTitle hook', () => {
    render()

    expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
  })

  it('should add a "New Appointment" button to the button tool bar', async () => {
    await act(async () => {
      await render()
    })

    expect(ButtonBarProvider.useButtonToolbarSetter).toHaveBeenCalled()
  })

  it('should render a calendar with the proper events', async () => {
    render()

    await waitFor(() => {
      expect(screen.getByText(expectedPatient.fullName as string)).toBeInTheDocument()
    })
  })
})
