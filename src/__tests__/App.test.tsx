import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import App from '../App'
import { RootState } from '../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

it('renders without crashing', async () => {
  // Supress the console.log in the test ouput
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, 'log').mockImplementation(() => {})

  const store = mockStore({
    components: {
      sidebarCollapsed: false,
    },
    breadcrumbs: {
      breadcrumbs: [],
    },
    user: {
      permissions: [],
    },
  } as any)

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  )

  expect(
    await screen.findByRole('heading', { name: /dashboard\.label/i }, { timeout: 8000 }),
  ).toBeInTheDocument()

  // eslint-disable-next-line no-console
  ;(console.log as jest.Mock).mockRestore()
})
