import '../../__mocks__/matchMediaMock'

import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../page-header/useTitle'
import Settings from '../../settings/Settings'
import { RootState } from '../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Settings', () => {
  const store = mockStore({ title: 'test' } as any)
  const history = createMemoryHistory()
  const titleSpy: any = jest.spyOn(titleUtil, 'default')
  history.push('/settings')

  mount(
    <Provider store={store}>
      <Router history={history}>
        <Settings />
      </Router>
    </Provider>,
  )

  it('should have Settings as the title', () => {
    expect(titleSpy).toHaveBeenCalledWith('settings.label')
  })
})
