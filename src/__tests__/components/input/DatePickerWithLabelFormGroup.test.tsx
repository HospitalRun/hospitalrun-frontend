import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Label } from '@hospitalrun/components'
import { shallow } from 'enzyme'
import DatePickerWithLabelFormGroup from '../../../components/input/DatePickerWithLabelFormGroup'

describe('date picker with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('htmlFor')).toEqual(`${expectedName}DatePicker`)
      expect(label.prop('text')).toEqual(expectedName)
    })

    it('should render and input box', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find('input')
      expect(input).toHaveLength(1)
      expect(input.prop('id')).toEqual(`${expectedName}DatePicker`)
      expect(input.prop('type')).toEqual('date')
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value=""
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find('input')
      expect(input).toHaveLength(1)
      expect(input.prop('disabled')).toBeTruthy()
    })

    it('should render the proper value', () => {
      const expectedName = 'test'
      const expectedValue = 'expected value'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find('input')
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
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={handler}
        />,
      )

      const input = wrapper.find('input')
      input.simulate('change')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
