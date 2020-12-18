import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../labs/Labs'
import * as titleUtil from '../../page-header/title/TitleContext'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Labs', () => {
  const setup = (initialEntry: string, permissions: Permissions[] = []) => {
    const store = mockStore({
      user: { permissions },
    } as any)

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <TitleProvider>
            <Labs />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  describe('routing', () => {
    describe('/labs/new', () => {
      it('should render the new lab request screen when /labs/new is accessed', async () => {
        const { container } = setup('/labs/new', [Permissions.RequestLab])

        expect(container.querySelector('form')).toBeInTheDocument()
      })

      it('should not navigate to /labs/new if the user does not have RequestLab permissions', async () => {
        const { container } = setup('/labs/new')

        expect(container.querySelector('form')).not.toBeInTheDocument()
      })
    })

    describe('/labs/:id', () => {
      it('should render the view lab screen when /labs/:id is accessed', async () => {
        setup('/labs/1234', [Permissions.ViewLab])

        expect(screen.getByText(/loading/i)).toBeInTheDocument()
      })
    })

    it('should not navigate to /labs/:id if the user does not have ViewLab permissions', async () => {
      setup('/labs/1234')

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })
})
