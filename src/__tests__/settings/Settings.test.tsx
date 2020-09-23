import { mount } from 'enzyme'
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
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    const store = mockStore({ title: 'test' } as any)

    const history = createMemoryHistory()
    history.push('/settings')

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>
            <Settings />
          </TitleProvider>
        </Router>
      </Provider>,
    )

    return wrapper
  }

  describe('layout', () => {
    it('should call the useUpdateTitle hook', () => {
      setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
    })
  })
})
