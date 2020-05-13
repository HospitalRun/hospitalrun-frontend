// eslint-disable-next-line no-restricted-imports
import '../__mocks__/matchMediaMock'

import { mount } from 'enzyme'
import React from 'react'

import App from 'App'
import HospitalRun from 'HospitalRun'

it('renders without crashing', () => {
  const wrapper = mount(<App />)
  expect(wrapper.find(HospitalRun)).toHaveLength(1)
})
