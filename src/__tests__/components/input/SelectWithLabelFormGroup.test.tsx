import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { shallow } from 'enzyme'
import { Label, Select } from '@hospitalrun/components'
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

      const options = select.find('option')
      expect(options).toHaveLength(2)
      expect(options.at(0).prop('value')).toEqual('')
      expect(options.at(0).text()).toEqual('-- Choose --')
      expect(options.at(1).prop('value')).toEqual('value1')
      expect(options.at(1).text()).toEqual('label1')
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
      const expectedValue = 'expected value'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
          value={expectedValue}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const select = wrapper.find(Select)
      expect(select).toHaveLength(1)
      expect(select.prop('value')).toEqual(expectedValue)
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

      const select = wrapper.find(Select)
      select.simulate('change')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
