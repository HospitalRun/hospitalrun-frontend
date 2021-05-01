import { Toaster } from '@hospitalrun/components'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { createMemoryHistory } from 'history'
import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../../page-header/title/TitleContext'
import NewAppointment from '../../../../scheduling/appointments/new/NewAppointment'
import AppointmentRepository from '../../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../../shared/db/PatientRepository'
import Appointment from '../../../../shared/model/Appointment'
import Patient from '../../../../shared/model/Patient'
import { RootState } from '../../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('New Appointment', () => {
  const expectedPatient: Patient = {
    addresses: [],
    bloodType: 'o',
    careGoals: [],
    carePlans: [],
    code: 'P-qrQc3FkCO',
    createdAt: new Date().toISOString(),
    dateOfBirth: new Date(0).toISOString(),
    emails: [],
    id: '123',
    index: '',
    isApproximateDateOfBirth: false,
    phoneNumbers: [],
    rev: '',
    sex: 'female',
    updatedAt: new Date().toISOString(),
    visits: [],
    givenName: 'Popo',
    prefix: 'Mr',
    fullName: 'Mr Popo',
  }

  const noRetryConfig = {
    queries: {
      retry: false,
    },
  }

  const setup = () => {
    const expectedAppointment = { id: '123' } as Appointment
    jest.spyOn(AppointmentRepository, 'save').mockResolvedValue(expectedAppointment)
    jest.spyOn(PatientRepository, 'search').mockResolvedValue([expectedPatient])

    const history = createMemoryHistory({ initialEntries: ['/appointments/new'] })

    return {
      expectedAppointment,
      history,
      ...render(
        <ReactQueryConfigProvider config={noRetryConfig}>
          <Provider store={mockStore({} as any)}>
            <Router history={history}>
              <TitleProvider>
                <NewAppointment />
              </TitleProvider>
            </Router>
            <Toaster draggable hideProgressBar />
          </Provider>
        </ReactQueryConfigProvider>,
      ),
    }
  }

  describe('layout', () => {
    it('should render an Appointment Detail Component', async () => {
      setup()

      expect(await screen.findByLabelText('new appointment form')).toBeInTheDocument()
    })
  })

  describe('on save click', () => {
    it('should have error when error saving without patient', async () => {
      setup()

      const expectedError = {
        message: 'scheduling.appointment.errors.createAppointmentError',
        patient: 'scheduling.appointment.errors.patientRequired',
      }

      const expectedAppointment = {
        patient: '',
        startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
        endDateTime: addMinutes(
          roundToNearestMinutes(new Date(), { nearestTo: 15 }),
          60,
        ).toISOString(),
        location: 'location',
        reason: 'reason',
        type: 'routine',
      } as Appointment

      userEvent.type(
        screen.getByPlaceholderText(/scheduling\.appointment\.patient/i),
        expectedAppointment.patient,
      )

      userEvent.click(screen.getByText(/scheduling.appointments.createAppointment/i))

      expect(screen.getByText(expectedError.message)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/scheduling\.appointment\.patient/i)).toHaveClass(
        'is-invalid',
      )
      expect(AppointmentRepository.save).not.toHaveBeenCalled()
    })

    it('should have error when error saving with end time earlier than start time', async () => {
      setup()

      const expectedError = {
        message: 'scheduling.appointment.errors.createAppointmentError',
        startDateTime: 'scheduling.appointment.errors.startDateMustBeBeforeEndDate',
      }

      const expectedAppointment = {
        patient: expectedPatient.fullName,
        startDateTime: new Date(2020, 10, 10, 0, 0, 0, 0).toISOString(),
        endDateTime: new Date(1957, 10, 10, 0, 0, 0, 0).toISOString(),
        location: 'location',
        reason: 'reason',
        type: 'routine',
      } as Appointment

      userEvent.type(
        screen.getByPlaceholderText(/scheduling\.appointment\.patient/i),
        expectedAppointment.patient,
      )
      fireEvent.change(within(screen.getByTestId('startDateDateTimePicker')).getByRole('textbox'), {
        target: { value: expectedAppointment.startDateTime },
      })
      fireEvent.change(within(screen.getByTestId('endDateDateTimePicker')).getByRole('textbox'), {
        target: { value: expectedAppointment.endDateTime },
      })
      userEvent.click(screen.getByText(/scheduling.appointments.createAppointment/i))

      expect(screen.getByText(expectedError.message)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/scheduling\.appointment\.patient/i)).toHaveClass(
        'is-invalid',
      )
      expect(
        within(screen.getByTestId('startDateDateTimePicker')).getByRole('textbox'),
      ).toHaveClass('is-invalid')
      expect(screen.getByText(expectedError.startDateTime)).toBeInTheDocument()
      expect(AppointmentRepository.save).toHaveBeenCalledTimes(0)
    })

    it('should call AppointmentRepo.save when save button is clicked', async () => {
      setup()

      const expectedAppointment = {
        patient: expectedPatient.fullName,
        startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
        endDateTime: addMinutes(
          roundToNearestMinutes(new Date(), { nearestTo: 15 }),
          60,
        ).toISOString(),
        location: 'location',
        reason: 'reason',
        type: 'routine',
      } as Appointment

      userEvent.type(
        screen.getByPlaceholderText(/scheduling\.appointment\.patient/i),
        expectedAppointment.patient,
      )
      userEvent.click(
        await screen.findByText(`${expectedPatient.fullName} (${expectedPatient.code})`),
      )

      fireEvent.change(within(screen.getByTestId('startDateDateTimePicker')).getByRole('textbox'), {
        target: { value: expectedAppointment.startDateTime },
      })

      fireEvent.change(within(screen.getByTestId('endDateDateTimePicker')).getByRole('textbox'), {
        target: { value: expectedAppointment.endDateTime },
      })

      userEvent.type(
        screen.getByRole('textbox', { name: /scheduling\.appointment\.location/i }),
        expectedAppointment.location,
      )

      userEvent.type(
        screen.getByPlaceholderText('-- Choose --'),
        `${expectedAppointment.type}{arrowdown}{enter}`,
      )

      const reasonInput = screen.queryAllByRole('textbox', { hidden: false })[3]
      userEvent.type(reasonInput, expectedAppointment.reason)

      userEvent.click(
        screen.getByRole('button', {
          name: /scheduling.appointments.createAppointment/i,
        }),
      )

      await waitFor(() => {
        expect(AppointmentRepository.save).toHaveBeenCalledWith({
          ...expectedAppointment,
          patient: expectedPatient.id,
        })
      })
    }, 30000)

    it('should navigate to /appointments/:id when a new appointment is created', async () => {
      const { history, expectedAppointment } = setup()

      userEvent.type(
        screen.getByPlaceholderText(/scheduling\.appointment\.patient/i),
        `${expectedPatient.fullName}`,
      )
      userEvent.click(
        await screen.findByText(`${expectedPatient.fullName} (${expectedPatient.code})`),
      )

      userEvent.click(screen.getByText(/scheduling.appointments.createAppointment/i))

      await waitFor(() => {
        expect(history.location.pathname).toEqual(`/appointments/${expectedAppointment.id}`)
      })
      await waitFor(() => {
        expect(screen.getByText(`scheduling.appointment.successfullyCreated`)).toBeInTheDocument()
      })
    })
  })

  describe('on cancel click', () => {
    it('should navigate back to /appointments', async () => {
      const { history } = setup()

      userEvent.click(screen.getByText(/actions\.cancel/i))

      expect(history.location.pathname).toEqual('/appointments')
    })
  })
})
