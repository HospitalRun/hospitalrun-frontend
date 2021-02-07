import { render, screen } from '@testing-library/react'
import userEvent, { specialChars } from '@testing-library/user-event'
import React from 'react'

import SelectWithLabelFormGroup from '../../../../shared/components/input/SelectWithLabelFormGroup'

const { arrowDown, enter } = specialChars

describe('select with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      render(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByText(expectedName)).toHaveAttribute('for', `${expectedName}Select`)
    })

    it('should render disabled is isDisable disabled is true', () => {
      render(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name="test"
          label="test"
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('should render the proper value', () => {
      const expectedLabel = 'label'
      render(
        <SelectWithLabelFormGroup
          options={[{ value: 'value', label: expectedLabel }]}
          name="test"
          label="test"
          defaultSelected={[{ value: 'value', label: expectedLabel }]}
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('combobox')).toHaveValue(expectedLabel)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedLabel = 'label1'
      const expectedValue = 'value1'
      const handler = jest.fn()
      render(
        <SelectWithLabelFormGroup
          options={[{ value: expectedValue, label: expectedLabel }]}
          name="name"
          label="test"
          isEditable
          onChange={handler}
        />,
      )

      userEvent.type(screen.getByRole('combobox'), `${expectedLabel}${arrowDown}${enter}`)

      expect(handler).toHaveBeenCalledWith([expectedValue])
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
