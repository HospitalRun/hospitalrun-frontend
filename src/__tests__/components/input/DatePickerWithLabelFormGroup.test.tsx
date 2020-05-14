import '../../../__mocks__/matchMediaMock'
import { DateTimePicker, Label } from '@hospitalrun/components'
import { shallow } from 'enzyme'
import React, { ChangeEvent } from 'react'

import DatePickerWithLabelFormGroup from '../../../components/input/DatePickerWithLabelFormGroup'

describe('date picker with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={new Date()}
          isEditable
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('htmlFor')).toEqual(`${expectedName}DatePicker`)
      expect(label.prop('text')).toEqual(expectedName)
    })

    it('should render and date time picker', () => {
      const expectedName = 'test'
      const expectedDate = new Date()
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={new Date()}
          isEditable
          onChange={jest.fn()}
          maxDate={expectedDate}
        />,
      )

      const input = wrapper.find(DateTimePicker)
      expect(input).toHaveLength(1)
      expect(input.prop('maxDate')).toEqual(expectedDate)
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={new Date()}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find(DateTimePicker)
      expect(input).toHaveLength(1)
      expect(input.prop('disabled')).toBeTruthy()
    })

    it('should render the proper value', () => {
      const expectedName = 'test'
      const expectedValue = new Date()
      const wrapper = shallow(
        <DatePickerWithLabelFormGroup
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const input = wrapper.find(DateTimePicker)
      expect(input).toHaveLength(1)
      expect(input.prop('selected')).toEqual(expectedValue)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedName = 'test'
      const expectedValue = new Date()
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

      const input = wrapper.find(DateTimePicker)
      input.prop('onChange')(new Date(), {
        target: { value: new Date().toISOString() },
      } as ChangeEvent<HTMLInputElement>)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
