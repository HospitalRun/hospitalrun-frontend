import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRequestSearch from '../../../medications/search/MedicationRequestSearch'

describe('Medication Request Search', () => {
  const setup = (givenSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }) => {
    const onChangeSpy = jest.fn()

    return {
      onChangeSpy,
      ...render(
        <MedicationRequestSearch searchRequest={givenSearchRequest} onChange={onChangeSpy} />,
      ),
    }
  }

  it('should render a select component with the default value', async () => {
    setup()
    const select = screen.getByRole('combobox')
    expect(select).not.toBeDisabled()
    expect(select).toHaveDisplayValue(/medications\.status\.draft/i)
    expect(screen.getByText(/medications\.filterTitle/i)).toBeInTheDocument()
    userEvent.click(select)

    const optionsContent = screen
      .getAllByRole('option')
      .map((option) => option.lastElementChild?.innerHTML)

    expect(
      optionsContent.includes(
        'medications.filter.all' &&
          'medications.status.draft' &&
          'medications.status.active' &&
          'medications.status.onHold' &&
          'medications.status.completed' &&
          'medications.status.enteredInError' &&
          'medications.status.canceled' &&
          'medications.status.unknown',
      ),
    ).toBe(true)
  })

  it('should update the search request when the filter updates', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const expectedNewValue = 'canceled'
    const { onChangeSpy } = setup()
    const select = screen.getByRole('combobox')

    userEvent.type(select, `{selectall}{backspace}${expectedNewValue}`)
    userEvent.click(screen.getByText(expectedNewValue))

    expect(onChangeSpy).toHaveBeenCalled()
    expect(onChangeSpy).toHaveBeenCalledWith({ ...expectedSearchRequest, status: expectedNewValue })
  })

  it('should render a text input with the default value', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    setup(expectedSearchRequest)
    const textInput = screen.getByLabelText(/medications\.search/i)

    expect(textInput).toBeInTheDocument()
    expect(textInput).toHaveAttribute('placeholder', 'medications.search')
    expect(textInput).toHaveAttribute('value', expectedSearchRequest.text)
    expect(textInput).not.toBeDisabled()
  })

  it('should update the search request when the text input is updated', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const expectedNewValue = 'someNewValue'
    const { onChangeSpy } = setup(expectedSearchRequest)
    const textInput = screen.getByLabelText(/medications\.search/i)

    userEvent.type(textInput, `{selectall}{backspace}${expectedNewValue}`)

    expect(onChangeSpy).toHaveBeenCalled()
    expect(onChangeSpy).toHaveBeenCalledWith({ ...expectedSearchRequest, text: expectedNewValue })
  })
})
