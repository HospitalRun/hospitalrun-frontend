import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../../page-header/title/TitleContext'
import EditAppointment from '../../../../scheduling/appointments/edit/EditAppointment'
import AppointmentRepository from '../../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../../shared/db/PatientRepository'
import Appointment from '../../../../shared/model/Appointment'
import Patient from '../../../../shared/model/Patient'
import { RootState } from '../../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Edit Appointment', () => {
  const expectedAppointment = {
    id: '123',
    patient: '456',
    startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
    endDateTime: addMinutes(roundToNearestMinutes(new Date(), { nearestTo: 15 }), 60).toISOString(),
    location: 'location',
    reason: 'reason',
    type: 'type',
  } as Appointment

  const expectedPatient = ({
    id: '456',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    fullName: 'givenName familyName suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as unknown) as Patient

  let history: any
  let store: MockStore

  const setup = async (mockAppointment: Appointment, mockPatient: Patient) => {
    jest.resetAllMocks()
    jest.spyOn(AppointmentRepository, 'saveOrUpdate').mockResolvedValue(mockAppointment)
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(mockAppointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)

    history = createMemoryHistory()
    store = mockStore({ appointment: { mockAppointment, mockPatient } } as any)

    history.push('/appointments/edit/123')

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/edit/:id">
            <TitleProvider>
              <EditAppointment />
            </TitleProvider>
          </Route>
        </Router>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should load an appointment when component loads', async () => {
    setup(expectedAppointment, expectedPatient)

    await waitFor(() => {
      expect(AppointmentRepository.find).toHaveBeenCalledWith(expectedAppointment.id)
    })
    await waitFor(() => {
      expect(PatientRepository.find).toHaveBeenCalledWith(expectedAppointment.patient)
    })
  })

  it('should updateAppointment when save button is clicked', async () => {
    setup(expectedAppointment, expectedPatient)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /scheduling.appointments.updateAppointment/i }),
      ).toBeInTheDocument()
    })

    userEvent.click(
      await screen.findByRole('button', { name: /scheduling.appointments.updateAppointment/i }),
    )

    await waitFor(() => {
      expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledWith(expectedAppointment)
    })
  })

  it('should navigate to /appointments/:id when save is successful', async () => {
    setup(expectedAppointment, expectedPatient)

    userEvent.click(
      await screen.findByRole('button', { name: /scheduling.appointments.updateAppointment/i }),
    )

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/appointments/123')
    })
  })

  it('should navigate to /appointments/:id when cancel is clicked', async () => {
    setup(expectedAppointment, expectedPatient)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /actions.cancel/i })).toBeInTheDocument()
    })

    userEvent.click(await screen.findByRole('button', { name: /actions.cancel/i }))

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/appointments/123')
    })
  })

  it('should render an edit appointment form', async () => {
    setup(expectedAppointment, expectedPatient)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /scheduling.appointments.updateAppointment/i }),
      ).toBeInTheDocument()
    })
  })
})
