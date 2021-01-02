import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../page-header/title/TitleContext'
import Settings from '../../settings/Settings'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Settings', () => {
  const setup = () => {
    const store = mockStore({ title: 'test' } as any)
    const history = createMemoryHistory()
    history.push('/settings')
    // eslint-disable-next-line react/prop-types
    const Wrapper: React.FC = ({ children }) => (
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>{children}</TitleProvider>
        </Router>
      </Provider>
    )
    return render(<Settings />, { wrapper: Wrapper })
  }
  test('should ', () => {
    setup()
  })
})
