import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../labs/Labs'
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider, useTitle } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const Title = () => {
  const { title } = useTitle()

  return <h1>{title}</h1>
}

const LabsWithTitle = () => (
  <TitleProvider>
    <Title />
    <Labs />
  </TitleProvider>
)

const setup = (ui: React.ReactElement, intialPath: string, permissions: Permissions[]) => {
  const store = mockStore({ user: { permissions } } as any)
  const history = createMemoryHistory({ initialEntries: [intialPath] })

  // eslint-disable-next-line react/prop-types
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  )

  return {
    history,
    ...render(ui, { wrapper: Wrapper }),
  }
}

describe('Labs', () => {
  describe('routing', () => {
    describe('/labs', () => {
      it('should render the view labs screen when /labs is accessed', async () => {
        const { history } = setup(<LabsWithTitle />, '/labs', [Permissions.ViewLabs])

        await waitFor(() => {
          expect(history.location.pathname).toBe('/labs')
        })
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /labs\.label/i })).toBeInTheDocument()
        })
      })

      it('should not navigate to /labs if the user does not have ViewLabs permissions', async () => {
        const { history } = setup(<LabsWithTitle />, '/labs', [])

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })

    describe('/labs/new', () => {
      it('should render the new lab request screen when /labs/new is accessed', async () => {
        const { history } = setup(<LabsWithTitle />, '/labs/new', [Permissions.RequestLab])

        await waitFor(() => {
          expect(history.location.pathname).toBe('/labs/new')
        })
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /labs\.requests\.new/i })).toBeInTheDocument()
        })
      })

      it('should not navigate to /labs/new if the user does not have RequestLab permissions', async () => {
        const { history } = setup(<LabsWithTitle />, '/labs/new', [])

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })

    describe('/labs/:id', () => {
      it('should render the view lab screen when /labs/:id is accessed', async () => {
        const expectedLab = {
          code: 'L-code',
          id: '1234',
          patient: '1234',
          type: 'Type',
          requestedOn: new Date().toISOString(),
        } as Lab
        const expectedPatient = {
          fullName: 'fullName',
          id: '1234',
        } as Patient

        jest.spyOn(LabRepository, 'find').mockResolvedValue(expectedLab)
        jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)

        const { history } = setup(
          <Route path="/labs/:id">
            <LabsWithTitle />
          </Route>,
          '/labs/1234',
          [Permissions.ViewLab],
        )

        await waitFor(() => {
          expect(history.location.pathname).toBe('/labs/1234')
        })
        await waitFor(() => {
          expect(
            screen.getByRole('heading', {
              name: `${expectedLab.type} for ${expectedPatient.fullName}(${expectedLab.code})`,
            }),
          ).toBeInTheDocument()
        })
      })

      it('should not navigate to /labs/:id if the user does not have ViewLab permissions', async () => {
        const { history } = setup(
          <Route path="/labs/:id">
            <LabsWithTitle />
          </Route>,
          '/labs/1234',
          [],
        )

        await waitFor(() => {
          expect(history.location.pathname).toBe('/')
        })
      })
    })
  })
})
