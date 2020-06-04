import '../../../__mocks__/matchMediaMock'

import { Label, Select } from '@hospitalrun/components'
import { shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import SelectWithLabelFormGroup from '../../../components/input/SelectWithLableFormGroup'

describe('select with label form group', () => {
  describe('layout', () => {
    it('should render a label', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('htmlFor')).toEqual(`${expectedName}Select`)
      expect(label.prop('text')).toEqual(expectedName)
    })

    it('should render a select with the proper options', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          value=""
          isEditable
          onChange={jest.fn()}
        />,
      )

      const select = wrapper.find(Select)
      expect(select).toHaveLength(1)

      const options = select.prop('options')
      expect(options).toHaveLength(2)
      expect(options[0].value).toEqual('')
      expect(options[0].label).toEqual('-- Choose --')
      expect(options[1].value).toEqual('value1')
      expect(options[1].label).toEqual('label1')
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          value=""
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const select = wrapper.find(Select)
      expect(select).toHaveLength(1)
      expect(select.prop('disabled')).toBeTruthy()
    })

    it('should render the proper value', () => {
      const expectedName = 'test'
      const expectedValue = 'value1'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
          ]}
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const select = wrapper.find(Select)
      expect(select).toHaveLength(1)
      expect(select.prop('defaultSelected')).toEqual([{ value: 'value1', label: 'label1' }])
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const expectedName = 'test'
      const expectedValue = 'expected value'
      const handler = jest.fn()
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={handler}
        />,
      )

      act(() => {
        const select = wrapper.find(Select)
        const onChange = select.prop('onChange') as any
        onChange([{ value: 'value1', label: 'label1' }])
      })

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith('value1')
    })
  })
})
