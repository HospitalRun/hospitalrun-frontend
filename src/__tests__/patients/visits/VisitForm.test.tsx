import { fireEvent, screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import React from 'react'
import selectEvent from 'react-select-event'

import VisitForm from '../../../patients/visits/VisitForm'
import Patient from '../../../shared/model/Patient'
import Visit, { VisitStatus } from '../../../shared/model/Visit'

describe('Visit Form', () => {
  let onVisitChangeSpy: any

  const visit: Visit = {
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    type: 'emergency',
    status: VisitStatus.Arrived,
    reason: 'routine visit',
    location: 'main',
  } as Visit

  const setup = (disabled = false, initializeVisit = true, error?: any) => {
    onVisitChangeSpy = jest.fn()
    const mockPatient = { id: '123' } as Patient
    return render(
      <VisitForm
        patient={mockPatient}
        onChange={onVisitChangeSpy}
        visit={initializeVisit ? visit : {}}
        disabled={disabled}
        visitError={error}
      />,
    )
  }

  it('should render a start date picker', () => {
    const { container } = setup()

    const startDateLabel = screen.getByText(/patient.visits.startdatetime/i)
    const requiredIcon = within(startDateLabel).getByRole('img', {
      hidden: true,
    })
    expect(requiredIcon.getAttribute('data-icon')).toEqual('asterisk')

    const startDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[0]
    expect(startDateTimePicker).toHaveDisplayValue(
      format(new Date(visit.startDateTime), 'MM/dd/yyyy h:mm aa'),
    )
  })

  it('should call the on change handler when start date changes', async () => {
    const expectedNewStartDateTime = new Date('01/01/2021 2:56 PM')
    const { container } = setup(false, false)

    const startDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[0]
    fireEvent.change(startDateTimePicker, {
      target: { value: format(expectedNewStartDateTime, 'MM/dd/yyyy h:mm aa') },
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({
      startDateTime: expectedNewStartDateTime.toISOString(),
    })
    expect(startDateTimePicker).toHaveDisplayValue(
      format(expectedNewStartDateTime, 'MM/dd/yyyy h:mm aa'),
    )
  })

  it('should render an end date picker', () => {
    const { container } = setup()

    const endDateLabel = screen.getByText(/patient.visits.enddatetime/i)
    const requiredIcon = within(endDateLabel).getByRole('img', {
      hidden: true,
    })
    expect(requiredIcon.getAttribute('data-icon')).toEqual('asterisk')

    const endDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[1]
    expect(endDateTimePicker).toHaveDisplayValue(
      format(new Date(visit.endDateTime), 'MM/dd/yyyy h:mm aa'),
    )
  })

  it('should call the on change handler when end date changes', () => {
    const expectedNewEndDateTime = new Date('01/01/2021 2:56 PM')
    const { container } = setup(false, false)

    const endDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[1]
    userEvent.type(endDateTimePicker, format(expectedNewEndDateTime, 'MM/dd/yyyy h:mm aa'))
    expect(endDateTimePicker).toHaveDisplayValue(
      format(new Date(expectedNewEndDateTime), 'MM/dd/yyyy h:mm aa'),
    )
    fireEvent.change(endDateTimePicker, {
      target: { value: format(expectedNewEndDateTime, 'MM/dd/yyyy h:mm aa') },
    })

    expect(onVisitChangeSpy).toHaveBeenCalledWith({
      endDateTime: expectedNewEndDateTime.toISOString(),
    })
    expect(endDateTimePicker).toHaveDisplayValue(
      format(expectedNewEndDateTime, 'MM/dd/yyyy h:mm aa'),
    )
  })

  it('should render a type input', () => {
    setup()

    expect(screen.getByText(/patient.visits.type/i)).toBeInTheDocument()

    const typeInput = screen.getByPlaceholderText(/patient.visits.type/i)

    expect(typeInput).toHaveDisplayValue(visit.type)
  })

  it('should call the on change handler when type changes', () => {
    const expectedNewType = 'some new type'
    setup(false, false)

    const typeInput = screen.getByPlaceholderText(/patient.visits.type/i)
    userEvent.type(typeInput, expectedNewType)

    expect(typeInput).toHaveDisplayValue(expectedNewType)

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ type: expectedNewType })
  })

  it('should render a status selector', () => {
    setup()

    const statusLabel = screen.getByText(/patient.visits.status/i)
    const requiredIcon = within(statusLabel).getByRole('img', {
      hidden: true,
    })
    expect(requiredIcon.getAttribute('data-icon')).toEqual('asterisk')

    const statusSelector = screen.getByPlaceholderText('-- Choose --')

    expect(statusSelector).toHaveDisplayValue(visit.status)

    selectEvent.openMenu(statusSelector)
    Object.values(VisitStatus).forEach((status) => {
      expect(screen.getByRole('option', { name: status })).toBeInTheDocument()
    })
  })

  it('should call the on change handler when status changes', async () => {
    const expectedNewStatus = VisitStatus.Finished
    setup(false, false)

    const statusSelector = screen.getByPlaceholderText('-- Choose --')

    await selectEvent.select(statusSelector, expectedNewStatus)

    expect(statusSelector).toHaveDisplayValue(expectedNewStatus)
    expect(onVisitChangeSpy).toHaveBeenCalledWith({ status: expectedNewStatus })
  })

  it('should render a reason input', () => {
    setup()
    const reasonLabel = screen.getByText(/patient.visits.reason/i)
    const requiredIcon = within(reasonLabel).getByRole('img', {
      hidden: true,
    })
    expect(requiredIcon.getAttribute('data-icon')).toEqual('asterisk')

    const reasonInput = screen.getAllByRole('textbox', { hidden: false })[3]

    expect(reasonInput).toHaveDisplayValue(visit.reason)
  })

  it('should call the on change handler when reason changes', () => {
    const expectedNewReason = 'some new reason'
    setup(false, false)

    const reasonInput = screen.getAllByRole('textbox', { hidden: false })[3]

    userEvent.paste(reasonInput, expectedNewReason)

    expect(onVisitChangeSpy).toHaveBeenCalledWith({ reason: expectedNewReason })
    // expect(reasonInput).toHaveDisplayValue(expectedNewReason)
  })

  it('should render a location input', () => {
    setup()

    const locationLabel = screen.getByText(/patient.visits.location/i)
    const requiredIcon = within(locationLabel).getByRole('img', {
      hidden: true,
    })
    expect(requiredIcon.getAttribute('data-icon')).toEqual('asterisk')

    const locationInput = screen.getByPlaceholderText(/patient.visits.location/i)
    expect(locationInput).toHaveDisplayValue(visit.location)
  })

  it('should call the on change handler when location changes', () => {
    const expectedNewLocation = 'some new location'
    setup(false, false)

    const locationInput = screen.getByPlaceholderText(/patient.visits.location/i)
    userEvent.type(locationInput, expectedNewLocation)

    expect(locationInput).toHaveDisplayValue(expectedNewLocation)
    expect(onVisitChangeSpy).toHaveBeenCalledWith({ location: expectedNewLocation })
  })

  it('should render all of the fields as disabled if the form is disabled', async () => {
    const { container } = setup(true)
    const startDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[0]
    const endDateTimePicker = container.querySelectorAll(
      '.react-datepicker__input-container input',
    )[1]
    const typeInput = screen.getByPlaceholderText(/patient.visits.type/i)
    const statusSelector = screen.getByPlaceholderText('-- Choose --')
    const reasonInput = screen.getAllByRole('textbox', { hidden: false })[3]
    const locationInput = screen.getByPlaceholderText(/patient.visits.location/i)

    expect(startDateTimePicker.hasAttribute('disabled')).toBeTruthy()
    expect(endDateTimePicker.hasAttribute('disabled')).toBeTruthy()
    expect(typeInput.hasAttribute('disabled')).toBeTruthy()
    expect(statusSelector.hasAttribute('disabled')).toBeTruthy()
    expect(reasonInput.hasAttribute('disabled')).toBeTruthy()
    expect(locationInput.hasAttribute('disabled')).toBeTruthy()
  })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      message: 'error message',
      startDateTime: 'start date error',
      endDateTime: 'end date error',
      type: 'type error',
      status: 'status error',
      reason: 'reason error',
      location: 'location error',
    }

    setup(false, false, expectedError)

    const alert = screen.getByRole('alert')
    const statusSelector = screen.getByPlaceholderText('-- Choose --')

    expect(alert).toHaveTextContent(expectedError.message)
    expect(screen.getByText(expectedError.startDateTime)).toBeInTheDocument()
    expect(screen.getByText(expectedError.endDateTime)).toBeInTheDocument()
    expect(screen.getByText(expectedError.type)).toBeInTheDocument()
    expect(statusSelector.classList).toContain('is-invalid')
    expect(screen.getByText(expectedError.reason)).toBeInTheDocument()
    expect(screen.getByText(expectedError.location)).toBeInTheDocument()
  })
})
