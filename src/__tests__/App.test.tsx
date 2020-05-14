import '../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import HospitalRun from '../HospitalRun'
import App from '../App'

it('renders without crashing', () => {
  const wrapper = mount(<App />)
  expect(wrapper.find(HospitalRun)).toHaveLength(1)
})
