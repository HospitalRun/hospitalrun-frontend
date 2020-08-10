import { shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import App from '../App'

it('renders without crashing', () => {
  const mockStore = configureStore()({})

  const AppWithStore = () => (
    <Provider store={mockStore}>
      <App />
    </Provider>
  )

  const wrapper = shallow(<AppWithStore />)
  expect(wrapper).toBeDefined()
})
