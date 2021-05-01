import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import React from 'react'

import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import Visit from '../../../shared/model/Visit'

describe('Diagnosis Form', () => {
  let onDiagnosisChangeSpy: any
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
  const date = new Date(Date.now()).toString()
  const visits = [
    {
      id: 'some visit',
      createdAt: '',
      updatedAt: '',
      startDateTime: date,
      endDateTime: '',
      type: 'type',
      status: 'arrived',
      reason: 'reason',
      location: '',
      rev: 'revValue',
    },
  ] as Visit[]
  const patient = {
    id: '12345',
    givenName: 'first',
    fullName: 'first',
    visits,
  } as Patient

  const setup = (disabled = false, initializeDiagnosis = true, error?: any) => {
    jest.resetAllMocks()
    onDiagnosisChangeSpy = jest.fn()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    return render(
      <DiagnosisForm
        onChange={onDiagnosisChangeSpy}
        diagnosis={initializeDiagnosis ? diagnosis : {}}
        diagnosisError={error}
        disabled={disabled}
        patient={patient}
      />,
    )
  }

  it('should render a name input', () => {
    setup()
    const nameInput = screen.getByLabelText(/patient.diagnoses.diagnosisName/i)
    const nameInputLabel = screen.getByText(/patient.diagnoses.diagnosisName/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveDisplayValue(diagnosis.name)
    expect(nameInputLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when name changes', () => {
    const expectedNewname = 'some new name'
    setup(false, false)
    const nameInput = screen.getByLabelText(/patient.diagnoses.diagnosisName/i)
    userEvent.paste(nameInput, expectedNewname)
    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ name: expectedNewname })
  })

  it('should render a visit selector', () => {
    setup()
    const visitSelector = within(screen.getByTestId('visitSelect')).getByRole('combobox')
    const visitSelectorLabel = screen.getByText(/patient.diagnoses.visit/i)
    expect(visitSelector).toBeInTheDocument()
    expect(visitSelector).toHaveDisplayValue('')
    expect(visitSelectorLabel).toBeInTheDocument()
    expect(visitSelectorLabel.title).not.toBe('This is a required input')
  })

  // it.only('should call the on change handler when visit changes', () => {
  //   const expectedNewVisit = patient.visits
  //   const { container } = setup()
  //   const visitSelector = screen.getAllByRole('combobox')[0]
  //   userEvent.click(visitSelector)
  //   act(() => {
  //     const visitSelector = wrapper.findWhere((w) => w.prop('name') === 'visit')
  //     const onChange = visitSelector.prop('onChange') as any
  //     onChange([expectedNewVisit])
  //   })

  //   expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ status: expectedNewVisit })
  // })

  it('should render a status selector', () => {
    setup()
    const statusSelector = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    const statusSelectorLabel = screen.getByText(/patient.diagnoses.status/i)
    expect(statusSelector).toBeInTheDocument()
    expect(statusSelector).toHaveValue(diagnosis.status)
    expect(statusSelectorLabel).toBeInTheDocument()
    expect(statusSelectorLabel.title).toBe('This is a required input')
    userEvent.click(statusSelector)
    const optionsList = screen
      .getAllByRole('listbox')
      .filter((item) => item.id === 'statusSelect')[0]
    const options = Array.prototype.map.call(optionsList.children, (li) => li.textContent)
    expect(options).toEqual(Object.values(DiagnosisStatus).map((v) => v))
  })

  it('should call the on change handler when status changes', () => {
    const expectedNewStatus = DiagnosisStatus.Active
    setup(false, false)
    const statusSelector = within(screen.getByTestId('statusSelect')).getByRole('combobox')
    userEvent.click(statusSelector)
    userEvent.click(screen.getByText(expectedNewStatus))
    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ status: expectedNewStatus })
  })

  it('should render a diagnosis date picker', () => {
    setup()
    const diagnosisDatePicker = within(screen.getByTestId('diagnosisDateDatePicker')).getByRole(
      'textbox',
    )
    const diagnosisDatePickerLabel = screen.getByText(/patient.diagnoses.diagnosisDate/i)
    expect(diagnosisDatePicker).toBeInTheDocument()
    expect(diagnosisDatePickerLabel).toBeInTheDocument()
    expect(diagnosisDatePickerLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when diagnosis date changes', () => {
    setup(false, false)
    const diagnosisDatePicker = within(screen.getByTestId('diagnosisDateDatePicker')).getByRole(
      'textbox',
    )
    userEvent.click(diagnosisDatePicker)
    userEvent.type(diagnosisDatePicker, '{backspace}1{enter}')
    expect(onDiagnosisChangeSpy).toHaveBeenCalled()
  })

  it('should render a onset date picker', () => {
    setup()
    const onsetDatePicker = within(screen.getByTestId('onsetDateDatePicker')).getByRole('textbox')
    const onsetDatePickerLabel = screen.getByText(/patient.diagnoses.onsetDate/i)
    expect(onsetDatePicker).toBeInTheDocument()
    expect(onsetDatePickerLabel).toBeInTheDocument()
    expect(onsetDatePickerLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when onset date changes', () => {
    setup(false, false)
    const onsetDatePicker = within(screen.getByTestId('onsetDateDatePicker')).getByRole('textbox')
    userEvent.click(onsetDatePicker)
    userEvent.type(onsetDatePicker, '{backspace}1{enter}')
    expect(onDiagnosisChangeSpy).toHaveBeenCalled()
  })

  it('should render a abatement date picker', () => {
    setup()
    const abatementDatePicker = within(screen.getByTestId('abatementDateDatePicker')).getByRole(
      'textbox',
    )
    const abatementDatePickerLabel = screen.getByText(/patient.diagnoses.abatementDate/i)
    expect(abatementDatePicker).toBeInTheDocument()
    expect(abatementDatePickerLabel).toBeInTheDocument()
    expect(abatementDatePickerLabel.title).toBe('This is a required input')
  })

  it('should call the on change handler when abatementDate date changes', () => {
    setup(false, false)
    const abatementDatePicker = within(screen.getByTestId('abatementDateDatePicker')).getByRole(
      'textbox',
    )
    userEvent.click(abatementDatePicker)
    userEvent.type(abatementDatePicker, '{backspace}1{enter}')
    expect(onDiagnosisChangeSpy).toHaveBeenCalled()
  })

  it('should render a note input', () => {
    setup()
    expect(screen.getByLabelText(/patient.diagnoses.note/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/patient.diagnoses.note/i)).toHaveValue(diagnosis.note)
  })

  it('should call the on change handler when note changes', () => {
    const expectedNewNote = 'some new note'
    setup(false, false)
    const noteInput = screen.getByLabelText(/patient.diagnoses.note/i)
    userEvent.type(noteInput, '{selectall}')
    userEvent.paste(noteInput, expectedNewNote)
    expect(onDiagnosisChangeSpy).toHaveBeenCalledWith({ note: expectedNewNote })
  })

  it('should render all of the fields as disabled if the form is disabled', () => {
    setup(true)
    const nameInput = screen.getByLabelText(/patient.diagnoses.diagnosisName/i)
    const statusSelector = screen.getAllByRole('combobox')[1]
    const diagnosisDatePicker = screen.getAllByDisplayValue(format(new Date(), 'MM/dd/yyyy'))[0]
    const onsetDatePicker = screen.getAllByDisplayValue(format(new Date(), 'MM/dd/yyyy'))[1]
    const abatementDatePicker = within(screen.getByTestId('abatementDateDatePicker')).getByRole(
      'textbox',
    )
    const noteInput = screen.getByLabelText(/patient.diagnoses.note/i)
    expect(nameInput).toBeDisabled()
    expect(statusSelector).toBeDisabled()
    expect(diagnosisDatePicker).toBeDisabled()
    expect(onsetDatePicker).toBeDisabled()
    expect(abatementDatePicker).toBeDisabled()
    expect(noteInput).toBeDisabled()
  })

  it('should render the form fields in an error state', () => {
    const expectedError = {
      message: 'some message error',
      name: 'some name error',
      diagnosisDate: 'some date error',
      onsetDate: 'some date error',
      abatementDate: 'some date error',
      status: 'some status error',
      note: 'some note error',
    }

    setup(false, false, expectedError)
    const alert = screen.getByRole('alert')
    const nameInput = screen.getByLabelText(/patient.diagnoses.diagnosisName/i)
    const statusSelector = screen.getAllByRole('combobox')[1]
    const diagnosisDatePicker = screen.getAllByDisplayValue(format(new Date(), 'MM/dd/yyyy'))[0]
    const onsetDatePicker = screen.getAllByDisplayValue(format(new Date(), 'MM/dd/yyyy'))[1]
    const abatementDatePicker = screen.getAllByDisplayValue(format(new Date(), 'MM/dd/yyyy'))[2]
    const noteInput = screen.getByLabelText(/patient.diagnoses.note/i)

    expect(alert).toBeInTheDocument()
    expect(screen.getByText(expectedError.message)).toBeInTheDocument()
    expect(nameInput).toHaveClass('is-invalid')
    expect(nameInput.nextSibling).toHaveTextContent(expectedError.name)
    expect(statusSelector).toHaveClass('is-invalid')
    expect(diagnosisDatePicker).toHaveClass('is-invalid')
    expect(onsetDatePicker).toHaveClass('is-invalid')
    expect(abatementDatePicker).toHaveClass('is-invalid')
    expect(screen.getAllByText(expectedError.diagnosisDate)).toHaveLength(3)
    expect(noteInput).toHaveClass('is-invalid')
    expect(noteInput.nextSibling).toHaveTextContent(expectedError.note)
  })
})
