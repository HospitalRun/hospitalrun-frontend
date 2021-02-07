import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import React from 'react'

import CarePlanForm from '../../../patients/care-plans/CarePlanForm'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('Care Plan Form', () => {
  let onCarePlanChangeSpy: any
  const diagnosis: Diagnosis = {
    id: '123',
    name: 'some diagnosis name',
    diagnosisDate: new Date().toISOString(),
    onsetDate: new Date().toISOString(),
    abatementDate: new Date().toISOString(),
    status: DiagnosisStatus.Active,
    note: 'some note',
    visit: 'some visit',
  }
  const carePlan: CarePlan = {
    id: 'id',
    title: 'title',
    description: 'description',
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Option,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    diagnosisId: diagnosis.id,
    createdOn: new Date().toISOString(),
    note: 'note',
  }
  const setup = (disabled = false, initializeCarePlan = true, error?: any) => {
    onCarePlanChangeSpy = jest.fn()
    const mockPatient = { id: '123', diagnoses: [diagnosis] } as Patient

    return render(
      <CarePlanForm
        patient={mockPatient}
        onChange={onCarePlanChangeSpy}
        carePlan={initializeCarePlan ? carePlan : {}}
        disabled={disabled}
        carePlanError={error}
      />,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a title input', () => {
    setup()
    expect(screen.getByLabelText(/patient.carePlan.title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/patient.carePlan.title/i)).toHaveValue(carePlan.title)
    expect(screen.getByText(/patient.carePlan.title/i).title).toBe('This is a required input')
  })

  it('should call the on change handler when title changes', () => {
    const expectedNewTitle = 'some new title'
    setup(false, false)
    userEvent.type(screen.getByLabelText(/patient.carePlan.title/i), expectedNewTitle)
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ title: expectedNewTitle })
  })

  it('should render a description input', () => {
    setup()
    expect(screen.getByLabelText(/patient.carePlan.description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/patient.carePlan.description/i)).toHaveValue(carePlan.description)
    expect(screen.getByText(/patient.carePlan.description/i).title).toBe('This is a required input')
  })

  it('should call the on change handler when description changes', () => {
    const expectedNewDescription = 'some new description'
    setup(false, false)
    userEvent.paste(screen.getByLabelText(/patient.carePlan.description/i), expectedNewDescription)
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ description: expectedNewDescription })
  })

  it('should render a condition selector with the diagnoses from the patient', async () => {
    setup()
    const conditionSelector = screen.getByDisplayValue(diagnosis.name)
    const conditionSelectorLabel = screen.getByText(/patient.carePlan.condition/i)
    expect(conditionSelector).toBeInTheDocument()
    expect(conditionSelector).toHaveValue(diagnosis.name)
    expect(conditionSelectorLabel).toBeInTheDocument()
    expect(conditionSelectorLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when condition changes', async () => {
    setup(false, false)
    const conditionSelector = within(screen.getByTestId('conditionSelect')).getByRole('combobox')
    userEvent.type(conditionSelector, `${diagnosis.name}{arrowdown}{enter}`)
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ diagnosisId: diagnosis.id })
  })

  it('should render a status selector', () => {
    setup()
    const statusSelector = screen.getByDisplayValue(carePlan.status)
    const statusSelectorLabel = screen.getByText(/patient.carePlan.status/i)
    expect(statusSelector).toBeInTheDocument()
    expect(statusSelector).toHaveValue(carePlan.status)
    expect(statusSelectorLabel).toBeInTheDocument()
    expect(statusSelectorLabel.title).toBe('This is a required input')
    userEvent.click(statusSelector)
    const optionsList = screen
      .getAllByRole('listbox')
      .filter((item) => item.id === 'statusSelect')[0]
    const options = Array.prototype.map.call(optionsList.children, (li) => li.textContent)
    expect(options).toEqual(Object.values(CarePlanStatus).map((v) => v))
  })

  it('should call the on change handler when status changes', () => {
    const expectedNewStatus = CarePlanStatus.Revoked
    setup()
    const statusSelector = screen.getByDisplayValue(carePlan.status)
    userEvent.click(statusSelector)
    userEvent.click(screen.getByText(expectedNewStatus))
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: expectedNewStatus }),
    )
  })

  it('should render an intent selector', () => {
    setup()
    const intentSelector = screen.getByDisplayValue(carePlan.intent)
    const intentSelectorLabel = screen.getByText(/patient.carePlan.intent/i)
    expect(intentSelector).toBeInTheDocument()
    expect(intentSelector).toHaveValue(carePlan.intent)
    expect(intentSelectorLabel).toBeInTheDocument()
    expect(intentSelectorLabel.title).toBe('This is a required input')
    userEvent.click(intentSelector)
    const optionsList = screen
      .getAllByRole('listbox')
      .filter((item) => item.id === 'intentSelect')[0]
    const options = Array.prototype.map.call(optionsList.children, (li) => li.textContent)
    expect(options).toEqual(Object.values(CarePlanIntent).map((v) => v))
  })

  it('should call the on change handler when intent changes', () => {
    const newIntent = CarePlanIntent.Proposal
    setup()
    const intentSelector = screen.getByDisplayValue(carePlan.intent)
    userEvent.click(intentSelector)
    userEvent.click(screen.getByText(newIntent))
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ intent: newIntent }))
  })

  it('should render a start date picker', () => {
    setup()
    const date = format(new Date(carePlan.startDate), 'MM/dd/yyyy')
    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    const startDatePickerLabel = screen.getByText(/patient.carePlan.startDate/i)
    expect(startDatePicker).toBeInTheDocument()
    expect(startDatePicker).toHaveValue(date)
    expect(startDatePickerLabel).toBeInTheDocument()
    expect(startDatePickerLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when start date changes', () => {
    setup()
    const startDatePicker = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    userEvent.type(startDatePicker, '{arrowdown}{arrowleft}{enter}')
    expect(onCarePlanChangeSpy).toHaveBeenCalledTimes(1)
  })

  it('should render an end date picker', () => {
    setup()
    const date = format(new Date(carePlan.endDate), 'MM/dd/yyyy')
    const endDatePicker = within(screen.getByTestId('endDateDatePicker')).getByRole('textbox')
    const endDatePickerLabel = screen.getByText(/patient.carePlan.endDate/i)
    expect(endDatePicker).toBeInTheDocument()
    expect(endDatePicker).toHaveValue(date)
    expect(endDatePickerLabel).toBeInTheDocument()
    expect(endDatePickerLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when end date changes', () => {
    setup()
    const endDatePicker = within(screen.getByTestId('endDateDatePicker')).getByRole('textbox')
    userEvent.type(endDatePicker, '{arrowdown}{arrowleft}{enter}')
    expect(onCarePlanChangeSpy).toHaveBeenCalledTimes(1)
  })

  it('should render a note input', () => {
    setup()
    const noteInput = screen.getByLabelText(/patient.carePlan.note/i)
    expect(noteInput).toBeInTheDocument()
    expect(noteInput).toHaveTextContent(carePlan.note)
  })

  it('should call the on change handler when note changes', () => {
    const expectedNewNote = 'some new note'
    setup(false, false)
    const noteInput = screen.getByLabelText(/patient.carePlan.note/i)
    userEvent.paste(noteInput, expectedNewNote)
    expect(onCarePlanChangeSpy).toHaveBeenCalledWith({ note: expectedNewNote })
  })

  it('should render all of the fields as disabled if the form is disabled', () => {
    setup(true)
    expect(screen.getByLabelText(/patient.carePlan.title/i)).toBeDisabled()
    expect(screen.getByLabelText(/patient.carePlan.description/i)).toBeDisabled()
    // condition
    expect(screen.getByDisplayValue(diagnosis.name)).toBeDisabled()
    expect(screen.getByDisplayValue(carePlan.status)).toBeDisabled()
    expect(screen.getByDisplayValue(carePlan.intent)).toBeDisabled()
    expect(within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')).toBeDisabled()
    expect(within(screen.getByTestId('endDateDatePicker')).getByRole('textbox')).toBeDisabled()
    expect(screen.getByLabelText(/patient.carePlan.note/i)).toBeDisabled()
  })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      message: 'some error message',
      title: 'some title error',
      description: 'some description error',
      status: 'some status error',
      intent: 'some intent error',
      startDate: 'some start date error',
      endDate: 'some end date error',
      note: 'some note error',
      condition: 'some condition error',
    }
    setup(false, false, expectedError)
    const alert = screen.getByRole('alert')
    const titleInput = screen.getByLabelText(/patient.carePlan.title/i)
    const descriptionInput = screen.getByLabelText(/patient.carePlan.description/i)
    const conditionInput = within(screen.getByTestId('conditionSelect')).getByRole('combobox')
    const statusInput = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    const intentInput = within(screen.getByTestId('intentSelect')).getByRole('combobox')
    const startDateInput = within(screen.getByTestId('startDateDatePicker')).getByRole('textbox')
    const endDateInput = within(screen.getByTestId('endDateDatePicker')).getByRole('textbox')
    const noteInput = screen.getByLabelText(/patient.carePlan.note/i)
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(expectedError.message)
    expect(titleInput).toHaveClass('is-invalid')
    expect(titleInput.nextSibling).toHaveTextContent(expectedError.title)
    expect(descriptionInput).toHaveClass('is-invalid')
    expect(descriptionInput.nextSibling).toHaveTextContent(expectedError.description)
    expect(conditionInput).toHaveClass('is-invalid')
    // expect(conditionInput.nextSibling).toHaveTextContent(
    //   expectedError.condition,
    // )
    expect(statusInput).toHaveClass('is-invalid')
    // expect(statusInput.nextSibling).toHaveTextContent(
    //   expectedError.status,
    // )
    expect(intentInput).toHaveClass('is-invalid')
    // expect(intentInput.nextSibling).toHaveTextContent(
    //   expectedError.intent,
    // )
    expect(startDateInput).toHaveClass('is-invalid')
    expect(screen.getByText(expectedError.startDate)).toBeInTheDocument()
    expect(endDateInput).toHaveClass('is-invalid')
    expect(screen.getByText(expectedError.endDate)).toBeInTheDocument()
    expect(noteInput).toHaveClass('is-invalid')
    expect(noteInput.nextSibling).toHaveTextContent(expectedError.note)
  })
})
