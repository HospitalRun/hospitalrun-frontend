import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import TextFieldWithLabelFormGroup from '../../../../shared/components/input/TextFieldWithLabelFormGroup'

describe('text field with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'

      render(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByText(expectedName)).toHaveAttribute('for', `${expectedName}TextField`)
    })

    it('should render label as required if isRequired is true', () => {
      render(
        <TextFieldWithLabelFormGroup
          name="test"
          label="test"
          value=""
          isEditable
          isRequired
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByTitle(/required/i)).toBeInTheDocument()
    })

    it('should render a text field', () => {
      render(
        <TextFieldWithLabelFormGroup
          name="test"
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render disabled is isDisable disabled is true', () => {
      render(
        <TextFieldWithLabelFormGroup
          name="test"
          label="test"
          value=""
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should render the proper value', () => {
      const expectedValue = 'expected value'

      render(
        <TextFieldWithLabelFormGroup
          data-testid="test"
          name="test"
          label="test"
          value={expectedValue}
          isEditable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('textbox')).toHaveValue(expectedValue)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedValue = 'expected value'
      let callBackValue = ''

      render(
        <TextFieldWithLabelFormGroup
          name="test"
          label="test"
          value=""
          isEditable
          onChange={(e) => {
            callBackValue += e.target.value
          }}
        />,
      )

      userEvent.type(screen.getByRole('textbox'), expectedValue)

      expect(callBackValue).toBe(expectedValue)
    })
  })
})
