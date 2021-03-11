import { Toaster } from '@hospitalrun/components'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import addMinutes from 'date-fns/addMinutes'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { queryCache } from 'react-query'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ButtonBarProvider } from '../../../../page-header/button-toolbar/ButtonBarProvider'
import ButtonToolbar from '../../../../page-header/button-toolbar/ButtonToolBar'
import * as titleUtil from '../../../../page-header/title/TitleContext'
import ViewAppointment from '../../../../scheduling/appointments/view/ViewAppointment'
import AppointmentRepository from '../../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../../shared/db/PatientRepository'
import Appointment from '../../../../shared/model/Appointment'
import Patient from '../../../../shared/model/Patient'
import Permissions from '../../../../shared/model/Permissions'
import { RootState } from '../../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const setup = (permissions = [Permissions.ReadAppointments], skipSpies = false) => {
  const expectedAppointment = {
    id: '123',
    startDateTime: new Date().toISOString(),
    endDateTime: addMinutes(new Date(), 60).toISOString(),
    reason: 'reason',
    location: 'location',
    type: 'checkup',
    patient: '123',
  } as Appointment
  const expectedPatient = {
    id: '123',
    fullName: 'full name',
  } as Patient

  if (!skipSpies) {
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(expectedAppointment)
    jest.spyOn(AppointmentRepository, 'delete').mockResolvedValue(expectedAppointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  }

  const history = createMemoryHistory({
    initialEntries: [`/appointments/${expectedAppointment.id}`],
  })
  const store = mockStore({
    user: {
      permissions,
    },
  } as any)

  return {
    history,
    expectedAppointment,
    expectedPatient,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <ButtonBarProvider>
            <ButtonToolbar />
            <Route path="/appointments/:id">
              <TitleProvider>
                <ViewAppointment />
              </TitleProvider>
            </Route>
          </ButtonBarProvider>
          <Toaster draggable hideProgressBar />
        </Router>
      </Provider>,
    ),
  }
}

describe('View Appointment', () => {
  beforeEach(() => {
    queryCache.clear()
    jest.resetAllMocks()
  })

  it('should add a "Edit Appointment" button to the button tool bar if has WriteAppointment permissions', async () => {
    setup([Permissions.WriteAppointments])

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /actions\.edit/i })).toBeInTheDocument()
    })
  })

  it('should add a "Delete Appointment" button to the button tool bar if has DeleteAppointment permissions', async () => {
    setup([Permissions.DeleteAppointment])

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /scheduling\.appointments\.deleteAppointment/i }),
      ).toBeInTheDocument()
    })
  })

  it('button toolbar empty if has only ReadAppointments permission', async () => {
    setup()

    expect(
      await screen.findByPlaceholderText(/scheduling\.appointment\.patient/i),
    ).toBeInTheDocument()

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('should call getAppointment by id if id is present', async () => {
    const { expectedAppointment } = setup()

    expect(AppointmentRepository.find).toHaveBeenCalledWith(expectedAppointment.id)
  })

  // This relies on an implementation detial... Dunno how else to make it work
  it('should render a loading spinner', () => {
    // Force null as patient response so we get the "loading" condition
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce((null as unknown) as Patient)

    const { container } = setup([Permissions.ReadAppointments], true)

    expect(container.querySelector(`[class^='css-']`)).toBeInTheDocument()
  })

  it('should render an AppointmentDetailForm with the correct data', async () => {
    const { expectedAppointment, expectedPatient } = setup()

    const patientInput = await screen.findByDisplayValue(expectedPatient.fullName as string)
    expect(patientInput).toBeDisabled()

    const startDateInput = screen.getByDisplayValue(
      format(new Date(expectedAppointment.startDateTime), 'MM/dd/yyyy h:mm a'),
    )
    expect(startDateInput).toBeDisabled()

    const endDateInput = screen.getByDisplayValue(
      format(new Date(expectedAppointment.endDateTime), 'MM/dd/yyyy h:mm a'),
    )
    expect(endDateInput).toBeDisabled()

    const locationInput = screen.getByDisplayValue(expectedAppointment.location)
    expect(locationInput).toBeDisabled()

    // This is a weird one, because the type has a matched i18n description
    const typeInput = screen.getByDisplayValue(
      `scheduling.appointment.types.${expectedAppointment.type}`,
    )
    expect(typeInput).toBeDisabled()

    const reasonInput = screen.getByDisplayValue(expectedAppointment.reason)
    expect(reasonInput).toBeDisabled()
  })

  it('should delete the appointment after clicking the delete appointment button, and confirming in the delete confirmation modal', async () => {
    const { expectedAppointment, history } = setup([
      Permissions.ReadAppointments,
      Permissions.DeleteAppointment,
    ])

    userEvent.click(
      screen.getByRole('button', { name: /scheduling\.appointments\.deleteAppointment/i }),
    )

    await waitFor(() => {
      expect(screen.getByText(/actions.confirmDelete/i)).toBeInTheDocument()
    })
    expect(
      screen.getByText(/scheduling\.appointment\.deleteConfirmationMessage/i),
    ).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: /actions\.delete/i }))

    await waitFor(() => {
      expect(AppointmentRepository.delete).toHaveBeenCalledTimes(1)
    })
    expect(AppointmentRepository.delete).toHaveBeenCalledWith(expectedAppointment)

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/appointments')
    })
    await waitFor(() => {
      expect(screen.getByText(/scheduling\.appointment\.successfullyDeleted/i)).toBeInTheDocument()
    })
  })

  it('should close the modal when the toggle button is clicked', async () => {
    setup([Permissions.ReadAppointments, Permissions.DeleteAppointment])

    userEvent.click(
      screen.getByRole('button', { name: /scheduling\.appointments\.deleteAppointment/i }),
    )

    await waitFor(() => {
      expect(screen.getByText(/actions.confirmDelete/i)).toBeInTheDocument()
    })

    userEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByText(/actions.confirmDelete/i)).not.toBeInTheDocument()
    })
  })
})
