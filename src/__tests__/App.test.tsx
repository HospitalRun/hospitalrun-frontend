import '../__mocks__/matchMediaMock'

import { shallow } from 'enzyme'
import React from 'react'

import App from '../App'
import HospitalRun from '../HospitalRun'
import Login from '../login/Login'

it('renders without crashing', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.find(HospitalRun)).toHaveLength(1)
  expect(wrapper.find(Login)).toHaveLength(1)
})
