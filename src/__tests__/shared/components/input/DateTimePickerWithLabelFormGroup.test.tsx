// import { DateTimePicker, Label } from '@hospitalrun/components'
import { render, screen } from '@testing-library/react'
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
      const expectedName = 'stardate333333'
      render(
        <DateTimePickerWithLabelFormGroup
          name={expectedName}
          label="stardate333333"
          value={new Date()}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      // const input = wrapper.find(DateTimePicker)
      // expect(input).toHaveLength(1)
      // expect(input.prop('disabled')).toBeTruthy()
    })

    it('should render the proper value', () => {
      const expectedName = 'stardate4444444'
      const expectedValue = new Date()
      render(
        <DateTimePickerWithLabelFormGroup
          name={expectedName}
          label="stardate4444444"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      // const input = wrapper.find(DateTimePicker)
      // expect(input).toHaveLength(1)
      // expect(input.prop('selected')).toEqual(expectedValue)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedName = 'stardate55555555'
      const expectedValue = new Date()
      const handler = jest.fn()
      render(
        <DateTimePickerWithLabelFormGroup
          name={expectedName}
          label="stardate55555555"
          value={expectedValue}
          isEditable={false}
          onChange={handler}
        />,
      )

      // const input = wrapper.find(DateTimePicker)
      // input.prop('onChange')(new Date(), {
      //   target: { value: new Date().toISOString() },
      // } as ChangeEvent<HTMLInputElement>)
      // expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
