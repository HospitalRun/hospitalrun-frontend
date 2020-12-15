import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import App from '../App'

// TODO: Causing Cannot log after tests are done. "Did you forget to wait for something async in your test? Attempted to log "Error: connect ECONNREFUSED 127.0.0.1:80 at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1133:16)"
// ? MSW integration with tests
it('renders without crashing', async () => {
  const mockStore = configureStore()({})

  const AppWithStore = () => (
    <Provider store={mockStore}>
      <App />
    </Provider>
  )

  const { container } = render(<AppWithStore />)
  // ! until the Error mention in above TODO is resolved smoke testing the container is a placeholder
  expect(container).toBeInTheDocument()
})
