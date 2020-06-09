import '../../../__mocks__/matchMediaMock'

import { Label, TextField } from '@hospitalrun/components'
import { shallow } from 'enzyme'
import React from 'react'

import TextFieldWithLabelFormGroup from '../../../components/input/TextFieldWithLabelFormGroup'

describe('text field with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('htmlFor')).toEqual(`${expectedName}TextField`)
      expect(label.prop('text')).toEqual(expectedName)
    })

    it('should render label as required if isRequired is true', () => {
      const expectedName = 'test'
      const expectedRequired = true
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          isRequired={expectedRequired}
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('isRequired')).toBeTruthy()
    })

    it('should render a text field', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find(TextField)
      expect(input).toHaveLength(1)
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find(TextField)
      expect(input).toHaveLength(1)
      expect(input.prop('disabled')).toBeTruthy()
    })

    it('should render the proper value', () => {
      const expectedName = 'test'
      const expectedValue = 'expected value'
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find(TextField)
      expect(input).toHaveLength(1)
      expect(input.prop('value')).toEqual(expectedValue)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedName = 'test'
      const expectedValue = 'expected value'
      const handler = jest.fn()
      const wrapper = shallow(
        <TextFieldWithLabelFormGroup
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={handler}
        />,
      )

      const input = wrapper.find(TextField)
      input.simulate('change')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
