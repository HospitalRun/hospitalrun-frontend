import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import subYears from 'date-fns/subYears'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import GeneralInformation from '../../patients/GeneralInformation'
import Patient from '../../shared/model/Patient'

Date.now = jest.fn().mockReturnValue(new Date().valueOf())

// most fields use TextInputWithLabelFormGroup, an uncontrolled <input /> => tests are faster without onChange
function setup(patientArg: Patient, isEditable = true, error?: Record<string, unknown>) {
  return render(
    <Router history={createMemoryHistory()}>
      <GeneralInformation patient={patientArg} isEditable={isEditable} error={error} />
    </Router>,
  )
}

// however, TextFieldWithLabelFormGroup is controlled and needs explicit onChange
function setupControlled(patientArg: Patient, isEditable = true, error?: Record<string, unknown>) {
  const TestComponent = () => {
    const [patient, setPatient] = React.useState(patientArg)
    return (
      <GeneralInformation
        patient={patient}
        isEditable={isEditable}
        error={error}
        onChange={setPatient as (p: Partial<Patient>) => void}
      />
    )
  }
  render(
    <Router history={createMemoryHistory()}>
      <TestComponent />
    </Router>,
  )
}

const patient = {
  id: '1234321',
  prefix: 'MockPrefix',
  givenName: 'givenName',
  familyName: 'familyName',
  suffix: 'MockSuffix',
  sex: 'male',
  type: 'charity',
  bloodType: 'A-',
  dateOfBirth: startOfDay(subYears(new Date(), 30)).toISOString(),
  isApproximateDateOfBirth: false,
  occupation: 'MockOccupationValue',
  preferredLanguage: 'MockPreferredLanguage',
  phoneNumbers: [
    { value: '123456789', type: undefined, id: '123' },
    { value: '789012999', type: undefined, id: '456' },
  ],
  emails: [
    { value: 'abc@email.com', type: undefined, id: '789' },
    { value: 'xyz@email.com', type: undefined, id: '987' },
  ],
  addresses: [
    { value: 'address A', type: undefined, id: '654' },
    { value: 'address B', type: undefined, id: '321' },
  ],
  code: 'P00001',
} as Patient

it('should display errors', () => {
  const error = {
    message: 'red alert Error Message',
    givenName: 'given name Error Message',
    dateOfBirth: 'date of birth Error Message',
    phoneNumbers: ['phone number Error Message'],
    emails: ['email Error Message'],
  }
  setup(
    {
      phoneNumbers: [{ value: 'not a phone number', id: '123' }],
      emails: [{ value: 'not an email', id: '456' }],
    } as Patient,
    true,
    error,
  )

  expect(screen.getByRole(/alert/i)).toHaveTextContent(error.message)
  expect(screen.getByLabelText(/patient\.givenName/i)).toHaveClass('is-invalid')

  expect(screen.getByText(/given name Error Message/i)).toHaveClass('invalid-feedback')
  expect(screen.getByText(/date of birth Error Message/i)).toHaveClass('text-danger')
  expect(screen.getByText(/phone number Error Message/i)).toHaveClass('invalid-feedback')
  expect(screen.getByText(/email Error Message/i)).toHaveClass('invalid-feedback')

  expect(screen.getByDisplayValue(/not an email/i)).toHaveClass('is-invalid')
  expect(screen.getByDisplayValue(/not a phone number/i)).toHaveClass('is-invalid')
})

describe('General Information, readonly', () => {
  function typeReadonlyAssertion(inputElement: HTMLElement, mockValue: any) {
    expect(inputElement).toHaveDisplayValue(mockValue)
    userEvent.type(inputElement, 'wontexist')
    expect(inputElement).toHaveDisplayValue(mockValue)
    expect(inputElement).not.toHaveDisplayValue('wontexist')
  }

  it('should render the prefix', () => {
    setup(patient, false)

    typeReadonlyAssertion(screen.getByRole('textbox', { name: /patient\.prefix/i }), patient.prefix)
  })

  it('should render the given name', () => {
    setup(patient, false)
    typeReadonlyAssertion(screen.getByLabelText(/patient\.givenName/i), patient.givenName)
  })

  it('should render the family name', () => {
    setup(patient, false)
    typeReadonlyAssertion(screen.getByLabelText(/patient\.familyName/i), patient.familyName)
  })

  it('should render the suffix', () => {
    setup(patient, false)
    typeReadonlyAssertion(screen.getByLabelText(/patient\.suffix/i), patient.suffix)
  })

  it('should render the date of the birth of the patient', () => {
    setup(patient, false)
    const expectedDate = format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')
    typeReadonlyAssertion(screen.getByDisplayValue(expectedDate), [expectedDate])
  })

  it('should render the approximate age if patient.isApproximateDateOfBirth is true', () => {
    const newPatient = { ...patient, isApproximateDateOfBirth: true }
    setup(newPatient, false)
    typeReadonlyAssertion(screen.getByLabelText(/patient.approximateAge/i), '30')
  })

  it('should render the occupation of the patient', () => {
    setup(patient, false)
    typeReadonlyAssertion(screen.getByLabelText(/patient.occupation/i), patient.occupation)
  })

  it('should render the preferred language of the patient', () => {
    setup(patient, false)
    typeReadonlyAssertion(
      screen.getByLabelText(/patient.preferredLanguage/i),
      patient.preferredLanguage,
    )
  })

  it('should render the phone numbers of the patient', () => {
    setup(patient, false)
    const phoneNumberField = screen.getByDisplayValue(/123456789/i)
    expect(phoneNumberField).toHaveProperty('id', 'phoneNumber0TextInput')
    typeReadonlyAssertion(phoneNumberField, patient.phoneNumbers[0].value)
  })

  it('should render the emails of the patient', () => {
    setup(patient, false)
    const emailsField = screen.getByDisplayValue(/abc@email.com/i)
    expect(emailsField).toHaveProperty('id', 'email0TextInput')
    typeReadonlyAssertion(emailsField, patient.emails[0].value)
  })

  it('should render the addresses of the patient', () => {
    setup(patient, false)
    const phoneNumberField = screen.getByDisplayValue(/address A/i)
    expect(phoneNumberField).toHaveProperty('id', 'address0TextField')
    typeReadonlyAssertion(phoneNumberField, patient.addresses[0].value)
  })
  it('should render the sex select options', () => {
    setup(patient, false)
    const patientSex = screen.getByDisplayValue(/sex/)
    expect(patientSex).toBeDisabled()
    expect(patientSex).toHaveDisplayValue([/sex.male/i])
  })

  it('should render the blood type select options', () => {
    setup(patient, false)
    const bloodType = screen.getByDisplayValue(/bloodType/)
    expect(bloodType).toBeDisabled()
    expect(bloodType).toHaveDisplayValue(['bloodType.anegative'])
  })
  it('should render the patient type select options', () => {
    setup(patient, false)
    const patientType = screen.getByDisplayValue(/patient.type/)
    expect(patientType).toBeDisabled()
    expect(patientType).toHaveDisplayValue([/patient.types.charity/i])
  })
})

describe('General Information, isEditable', () => {
  function typeWritableAssertion(inputElement: HTMLElement, mockValue: any) {
    expect(inputElement).toHaveDisplayValue(mockValue)
    userEvent.type(inputElement, '{selectall}willexist')
    expect(inputElement).toHaveDisplayValue('willexist')
    expect(inputElement).not.toHaveDisplayValue(mockValue)
  }

  it('should render the prefix', () => {
    setup(patient)
    typeWritableAssertion(screen.getByRole('textbox', { name: /patient\.prefix/i }), patient.prefix)
  })

  it('should render the given name', () => {
    setup(patient)
    typeWritableAssertion(screen.getByPlaceholderText(/patient\.givenName/i), patient.givenName)
  })

  it('should render the family name', () => {
    setup(patient)
    typeWritableAssertion(screen.getByPlaceholderText(/patient\.familyName/i), patient.familyName)
  })

  it('should render the suffix', () => {
    setup(patient)
    typeWritableAssertion(screen.getByPlaceholderText(/patient\.suffix/i), patient.suffix)
  })

  it('should render the date of the birth of the patient', () => {
    setup(patient)

    const expectedDate = format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')
    const field = screen.getByDisplayValue(expectedDate)
    typeWritableAssertion(field, [expectedDate])

    // workaround for Warning: `NaN` is an invalid value for the `left` css style property.
    userEvent.type(field, '{enter}')
  })

  it('should render the occupation of the patient', () => {
    setup(patient)
    typeWritableAssertion(screen.getByLabelText(/patient.occupation/i), [patient.occupation])
  })

  it('should render the preferred language of the patient', () => {
    setup(patient)
    typeWritableAssertion(
      screen.getByLabelText(/patient.preferredLanguage/i),
      patient.preferredLanguage,
    )
  })

  it('should render the phone numbers of the patient', () => {
    setup(patient)
    const phoneNumberField = screen.getByDisplayValue(/123456789/i)
    expect(phoneNumberField).toHaveProperty('id', 'phoneNumber0TextInput')
    typeWritableAssertion(phoneNumberField, patient.phoneNumbers[0].value)
  })

  it('should render the emails of the patient', () => {
    setup(patient)
    const emailsField = screen.getByDisplayValue(/abc@email.com/i)
    expect(emailsField).toHaveProperty('id', 'email0TextInput')
    typeWritableAssertion(emailsField, patient.emails[0].value)
  })

  it('should render the addresses of the patient', () => {
    setupControlled(patient)

    const addressField = screen.getByDisplayValue(/address A/i)
    expect(addressField).toHaveProperty('id', 'address0TextField')
    typeWritableAssertion(addressField, patient.addresses[0].value)
  })

  it('should render the sex select', () => {
    setup(patient)
    const patientSex = screen.getByDisplayValue(/sex/)
    expect(patientSex).not.toBeDisabled()
    userEvent.click(patientSex)
    const bloodArr = [/sex.male/i, /sex.female/i, /sex.female/i, /sex.unknown/i]
    bloodArr.forEach((reg) => {
      const sexOption = screen.getByRole('option', { name: reg })
      userEvent.click(sexOption)
      expect(sexOption).toBeInTheDocument()
    })
  })

  it('should render the blood type select', () => {
    setup(patient)
    const bloodType = screen.getByDisplayValue(/bloodType/)
    expect(bloodType).not.toBeDisabled()
    userEvent.click(bloodType)
    const bloodArr = [
      /bloodType.apositive/i,
      /bloodType.anegative/i,
      /bloodType.abpositive/i,
      /bloodType.abnegative/i,
      /bloodType.bpositive/i,
      /bloodType.bnegative/i,
      /bloodType.opositive/i,
      /bloodType.onegative/i,
      /bloodType.unknown/i,
    ]
    bloodArr.forEach((reg) => {
      const bloodOption = screen.getByRole('option', { name: reg })
      userEvent.click(bloodOption)
      expect(bloodOption).toBeInTheDocument()
    })
  })

  it('should render the patient type select', () => {
    setup(patient)
    const patientType = screen.getByDisplayValue(/patient.type/)
    expect(patientType).not.toBeDisabled()
    userEvent.click(patientType)
    const bloodArr = [/patient.types.charity/i, /patient.types.private/i]
    bloodArr.forEach((reg) => {
      const typeOption = screen.getByRole('option', { name: reg })
      userEvent.click(typeOption)
      expect(typeOption).toBeInTheDocument()
    })
  })
})
