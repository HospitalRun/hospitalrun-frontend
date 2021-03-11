import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import ContactInfo from '../../patients/ContactInfo'
import { ContactInfoPiece } from '../../shared/model/ContactInformation'
import * as uuid from '../../shared/util/uuid'

describe('Contact Info in its Editable mode', () => {
  const data = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: '789012', type: undefined },
  ]
  const dataForNoAdd = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: ' ', type: undefined },
  ]
  const errors = ['this is an error', '']
  const label = 'Phone Number'
  const name = 'Number'
  let onChange: jest.Mock

  const setup = (_data?: ContactInfoPiece[], _errors?: string[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')
    onChange = jest.fn()

    return render(
      <Router history={history}>
        <ContactInfo
          component="TextInputWithLabelFormGroup"
          data={_data}
          errors={_errors}
          label={label}
          name={name}
          isEditable
          onChange={onChange}
        />
      </Router>,
    )
  }

  it('should call onChange if no data is provided', () => {
    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)
    setup()

    const expectedNewData = [{ id: newId, value: '' }]
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should render the labels if data is provided', () => {
    setup(data)

    expect(screen.getByText(/patient\.contactinfotype\.label/i)).toBeInTheDocument()
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should display the entries if data is provided', () => {
    setup(data)

    expect(screen.getAllByRole('textbox')[1]).toHaveValue(`${data[0].value}`)

    const selectInput = within(screen.getByTestId('NumberType0Select')).getByRole('combobox')

    expect(selectInput).toHaveValue('patient.contactInfoType.options.home')
  })

  it('should display the error if error is provided', () => {
    setup(data, errors)

    expect(screen.getByText(/this is an error/i)).toBeInTheDocument()
  })

  it('should display the add button', () => {
    setup(data)
    expect(screen.getByRole('button', { name: /actions\.add/i })).toBeInTheDocument()
  })

  it('should call the onChange callback if input is changed', () => {
    setup(data)

    const expectedNewData = [
      { id: '123', value: '777777', type: 'home' },
      { id: '456', value: '789012', type: undefined },
    ]

    const inputElement = screen.getAllByRole('textbox')[1]
    expect(inputElement).toHaveValue(`${data[0].value}`)
    userEvent.clear(inputElement)
    userEvent.type(inputElement, expectedNewData[0].value)
    expect(inputElement).toHaveValue(`${expectedNewData[0].value}`)

    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should call the onChange callback if an add button is clicked with valid entries', () => {
    setup(data)
    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)

    expect(screen.getByRole('button')).toBeInTheDocument()
    userEvent.click(screen.getByRole('button'))

    const expectedNewData = [...data, { id: newId, value: '' }]

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should call the onChange callback if an add button is clicked with an empty entry', () => {
    setup(dataForNoAdd)

    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)

    expect(screen.getByRole('button')).toBeInTheDocument()
    userEvent.click(screen.getByRole('button'))

    const expectedNewData = [
      { id: '123', value: '123456', type: 'home' },
      { id: newId, value: '' },
    ]

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })
})

describe('Contact Info in its non-Editable mode', () => {
  const data = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: '789012', type: undefined },
  ]
  const label = 'Phone Number'
  const name = 'Number'

  const setup = (_data?: ContactInfoPiece[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')

    return render(
      <Router history={history}>
        <ContactInfo
          component="TextInputWithLabelFormGroup"
          data={_data}
          label={label}
          name={name}
        />
      </Router>,
    )
  }

  it('should render an empty element if no data is present', () => {
    const { container } = setup()

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div />
      </div>
    `)
  })

  it('should render the labels if data is provided', () => {
    setup(data)

    expect(screen.getByText(/patient\.contactInfoType\.label/i)).toBeInTheDocument()
  })

  it('should display the entries if data is provided', () => {
    setup(data)

    const inputElement = screen.getAllByRole('textbox')[1]
    const selectInput = within(screen.getByTestId('NumberType0Select')).getByRole('combobox')
    expect(selectInput).toHaveDisplayValue('patient.contactInfoType.options.home')
    expect(inputElement).toHaveDisplayValue(`${data[0].value}`)
  })

  it('should show inputs that are not editable', () => {
    setup(data)
    const inputElement = screen.getAllByRole('textbox')[1]
    const selectInput = within(screen.getByTestId('NumberType0Select')).getByRole('combobox')

    expect(selectInput).not.toHaveFocus()
    expect(inputElement).not.toHaveFocus()
  })
})
