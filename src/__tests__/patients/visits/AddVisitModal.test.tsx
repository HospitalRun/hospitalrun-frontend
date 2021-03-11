import { screen, render, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import AddVisitModal from '../../../patients/visits/AddVisitModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { VisitStatus } from '../../../shared/model/Visit'

describe('Add Visit Modal', () => {
  const patient = {
    id: 'patientId',
    visits: [
      {
        id: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        type: 'standard type',
        status: VisitStatus.Arrived,
        reason: 'routine',
        location: 'main',
      },
    ],
  } as Patient

  const onCloseSpy = jest.fn()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()

    return render(
      <Router history={history}>
        <AddVisitModal show onCloseButtonClick={onCloseSpy} patientId={patient.id} />
      </Router>,
    )
  }

  it('should render a modal and within a form', () => {
    setup()

    expect(within(screen.getByRole('dialog')).getByLabelText('visit form')).toBeInTheDocument()
  })

  it('should call the on close function when the cancel button is clicked', () => {
    setup()
    userEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    )
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })

  it('should save the visit when the save button is clicked', async () => {
    setup()
    const testPatient = patient.visits[0]

    /* Date Pickers */
    const startDateInput = within(screen.getByTestId('startDateTimeDateTimePicker')).getByRole(
      'textbox',
    )
    const endDateInput = within(screen.getByTestId('endDateTimeDateTimePicker')).getByRole(
      'textbox',
    )

    fireEvent.change(startDateInput, { target: { value: testPatient.startDateTime } })
    fireEvent.change(endDateInput, { target: { value: testPatient.endDateTime } })

    /* Text */
    const typeInput = screen.getByPlaceholderText(/patient.visits.type/i)
    userEvent.type(typeInput, testPatient.type)

    const statusInput = screen.getByRole('combobox')
    userEvent.type(statusInput, `${testPatient.status}{arrowdown}{enter}`)

    const textareaReason = screen.getByLabelText(/patient\.visits\.reason/i)
    userEvent.type(textareaReason, testPatient.reason)

    const locationInput = screen.getByLabelText(/patient.visits.location/i)
    userEvent.type(locationInput, testPatient.location)

    const saveButton = screen.getByRole('button', { name: /patient.visits.new/i })
    userEvent.click(saveButton)

    await waitFor(() => {
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    })
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
  })
})
