import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import React from 'react'

import AppointmentDetailForm from '../../../scheduling/appointments/AppointmentDetailForm'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'

const setup = (appointment: Appointment, patient?: Patient, error = {}) => ({
  ...render(
    <AppointmentDetailForm appointment={appointment} patient={patient} isEditable error={error} />,
  ),
})

describe('AppointmentDetailForm', () => {
  it('should render a type select box', () => {
    const expectedAppointment = {
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        60,
      ).toISOString(),
      reason: 'reason',
      location: 'location',
      type: 'emergency',
    } as Appointment

    setup(expectedAppointment)

    const types = ['checkup', 'emergency', 'followUp', 'routine', 'walkIn']

    userEvent.click(screen.getByPlaceholderText('-- Choose --'))

    types.forEach((type) => {
      const typeOption = screen.getByRole('option', {
        name: `scheduling.appointment.types.${type}`,
      })
      expect(typeOption).toBeInTheDocument()
      userEvent.click(typeOption)
    })
  })

  it('should disable patient typeahead if patient prop passed', () => {
    const expectedAppointment = {
      startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
      endDateTime: addMinutes(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        60,
      ).toISOString(),
    } as Appointment
    const expectedPatient = {
      fullName: 'Mr Popo',
    } as Patient

    setup(expectedAppointment, expectedPatient)

    expect(screen.getByDisplayValue(expectedPatient.fullName as string)).toBeDisabled()
  })
})
