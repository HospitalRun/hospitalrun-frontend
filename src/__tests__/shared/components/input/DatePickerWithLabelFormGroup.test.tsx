import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import DatePickerWithLabelFormGroup from '../../../../shared/components/input/DatePickerWithLabelFormGroup'

describe('date picker with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'stardate1111'
      render(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="stardate11111"
          value={new Date('12/25/2020')}
          isEditable
          onChange={jest.fn()}
        />,
      )

      const name = screen.getByText(/stardate/i)
      expect(name).toHaveAttribute('for', `${expectedName}DatePicker`)
      expect(name).toHaveTextContent(expectedName)
      expect(screen.getByRole('textbox')).toHaveDisplayValue(['12/25/2020'])
    })
    it('should render disabled is isDisable disabled is true', () => {
      render(
        <DatePickerWithLabelFormGroup
          name="stardate22222"
          label="stardate22222"
          value={new Date()}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState(new Date('01/01/2019'))
        return (
          <DatePickerWithLabelFormGroup
            name="stardate3333"
            label="stardate3333"
            value={value}
            isEditable
            onChange={setValue}
          />
        )
      }
      render(<TestComponent />)
      const datepickerInput = screen.getByRole('textbox')

      expect(datepickerInput).toHaveDisplayValue(['01/01/2019'])
      userEvent.type(datepickerInput, '{selectall}12/25/2021{enter}')
      expect(datepickerInput).toHaveDisplayValue(['12/25/2021'])
    })
  })
})
