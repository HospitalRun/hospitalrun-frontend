import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { CombinedState } from 'redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../page-header/title/TitleContext'
import Settings from '../../settings/Settings'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Settings', () => {
  const setup = () => {
    const store = mockStore({ title: 'test' } as CombinedState<any>)
    const history = createMemoryHistory()
    history.push('/settings')
    return render(
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>
            <Settings />
          </TitleProvider>
        </Router>
      </Provider>,
    )
  }
  test('settings combo selection works', () => {
    setup()
    const langArr = [
      /Arabic/i,
      /Chinese/i,
      /English, American/i,
      /French/i,
      /German/i,
      /Italian/i,
      /Japanese/i,
      /Portuguese/i,
      /Russian/i,
      /Spanish/i,
    ]

    langArr.forEach((lang) => {
      const combobox = screen.getByRole('combobox')
      userEvent.click(combobox)
      expect(screen.getByRole('option', { name: lang })).toBeInTheDocument()
      userEvent.type(combobox, '{enter}')
    })
  })
})
