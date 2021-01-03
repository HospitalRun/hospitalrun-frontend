import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import DateTimePickerWithLabelFormGroup from '../../../../shared/components/input/DateTimePickerWithLabelFormGroup'

describe('date picker with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'stardate11111'
      render(
        <DateTimePickerWithLabelFormGroup
          name={expectedName}
          label="stardate11111"
          value={new Date()}
          isEditable
          onChange={jest.fn()}
        />,
      )

      const name = screen.getByText(/stardate/i)
      expect(name).toHaveAttribute('for', `${expectedName}DateTimePicker`)
      expect(name).toHaveTextContent(expectedName)
    })

    it('should render disabled is isDisable disabled is true', () => {
      render(
        <DateTimePickerWithLabelFormGroup
          name="stardate333333"
          label="stardate333333"
          value={new Date()}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should render the proper value', () => {
      render(
        <DateTimePickerWithLabelFormGroup
          name="stardate4444444"
          label="stardate4444444"
          value={new Date('12/25/2020 2:56 PM')}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )
      const datepickerInput = screen.getByRole('textbox')
      expect(datepickerInput).toBeDisabled()
      expect(datepickerInput).toHaveDisplayValue(/[12/25/2020 2:56 PM]/i)
    })
  })
})

describe('change handler', () => {
  it('should call the change handler on change', () => {
    render(
      <DateTimePickerWithLabelFormGroup
        name="stardate55555555"
        label="stardate55555555"
        value={new Date('1/1/2021 2:56 PM')}
        isEditable
        onChange={jest.fn()}
      />,
    )
    const datepickerInput = screen.getByRole('textbox')

    expect(datepickerInput).toHaveDisplayValue(/[01/01/2021 2:56 PM]/i)
    userEvent.type(datepickerInput, '{selectall}12/25/2020 2:56 PM{enter}')
    expect(datepickerInput).toHaveDisplayValue(/[12/25/2020 2:56 PM]/i)
  })
})
