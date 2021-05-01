import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import TextInputWithLabelFormGroup from '../../../../shared/components/input/TextInputWithLabelFormGroup'

describe('text input with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      const expectedLabel = 'label test'
      render(
        <TextInputWithLabelFormGroup
          name={expectedName}
          label={expectedLabel}
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByText(expectedLabel)).toHaveAttribute('for', `${expectedName}TextInput`)
    })

    it('should render a text field', () => {
      const expectedLabel = 'test'
      render(
        <TextInputWithLabelFormGroup
          name="test"
          label={expectedLabel}
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument()
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedLabel = 'test'
      render(
        <TextInputWithLabelFormGroup
          name="test"
          label={expectedLabel}
          value=""
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByLabelText(expectedLabel)).toBeDisabled()
    })

    it('should render the proper value', () => {
      const expectedLabel = 'test'
      const expectedValue = 'expected value'
      render(
        <TextInputWithLabelFormGroup
          name="test"
          label={expectedLabel}
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByLabelText(expectedLabel)).toHaveValue(expectedValue)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedLabel = 'test'
      const expectedValue = 'expected value'
      const handler = jest.fn()
      render(
        <TextInputWithLabelFormGroup
          name="test"
          label={expectedLabel}
          value=""
          isEditable
          onChange={handler}
        />,
      )

      const input = screen.getByLabelText(expectedLabel)
      userEvent.type(input, expectedValue)
      expect(input).toHaveValue(expectedValue)
      expect(handler).toHaveBeenCalledTimes(expectedValue.length)
    })
  })
})
