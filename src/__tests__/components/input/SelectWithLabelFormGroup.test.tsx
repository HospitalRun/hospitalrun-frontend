import '../../../__mocks__/matchMediaMock'

import { Label, Select } from '@hospitalrun/components'
import { shallow } from 'enzyme'
import React from 'react'

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
          isEditable
          onChange={jest.fn()}
        />,
      )

      const label = wrapper.find(Label)
      expect(label).toHaveLength(1)
      expect(label.prop('htmlFor')).toEqual(`${expectedName}Select`)
      expect(label.prop('text')).toEqual(expectedName)
    })

    it('should render disabled is isDisable disabled is true', () => {
      const expectedName = 'test'
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name={expectedName}
          label="test"
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
      const expectedDefaultSelected = [{ value: 'value', label: 'label' }]
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value', label: 'label' }]}
          name={expectedName}
          label="test"
          defaultSelected={expectedDefaultSelected}
          isEditable={false}
          onChange={jest.fn()}
        />,
      )

      const select = wrapper.find(Select)
      expect(select).toHaveLength(1)
      expect(select.prop('defaultSelected')).toEqual(expectedDefaultSelected)
    })
  })

  describe('change handler', () => {
    it('should call the change handler on change', () => {
      const handler = jest.fn()
      const wrapper = shallow(
        <SelectWithLabelFormGroup
          options={[{ value: 'value1', label: 'label1' }]}
          name="name"
          label="test"
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
