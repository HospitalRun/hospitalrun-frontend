import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewLabs from '../../labs/ViewLabs'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import ButtonToolbar from '../../page-header/button-toolbar/ButtonToolBar'
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const setup = (permissions: Permissions[] = []) => {
  const expectedLab = {
    code: 'L-1234',
    id: '1234',
    type: 'lab type',
    patient: 'patientId',
    status: 'requested',
    requestedOn: '2020-03-30T04:43:20.102Z',
  } as Lab

  jest.spyOn(LabRepository, 'findAll').mockResolvedValue([expectedLab])
  jest.spyOn(LabRepository, 'search')

  const history = createMemoryHistory()

  const store = mockStore({
    title: '',
    user: {
      permissions,
    },
  } as any)

  // eslint-disable-next-line react/prop-types
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>
        <ButtonBarProvider.ButtonBarProvider>
          <ButtonToolbar />
          <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
        </ButtonBarProvider.ButtonBarProvider>
      </Router>
    </Provider>
  )

  return {
    expectedLab,
    history,
    ...render(<ViewLabs />, { wrapper: Wrapper }),
  }
}

describe('View Labs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('button bar', () => {
    it('should display button to add new lab request', async () => {
      setup([Permissions.ViewLab, Permissions.RequestLab])

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /labs\.requests\.new/i })).toBeInTheDocument()
      })
    })

    it('should not display button to add new lab request if the user does not have permissions', async () => {
      setup([Permissions.ViewLabs])

      expect(screen.queryByRole('button', { name: /labs\.requests\.new/i })).not.toBeInTheDocument()
    })
  })

  describe('table', () => {
    it('should render a table with data', async () => {
      const { expectedLab } = setup([Permissions.ViewLabs, Permissions.RequestLab])

      expect(screen.getByRole('columnheader', { name: /labs.lab.code/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /labs.lab.type/i })).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /labs.lab.requestedOn/i }),
      ).toBeInTheDocument()

      expect(
        await screen.findByRole('columnheader', { name: /labs.lab.status/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /actions.view/i })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: expectedLab.code })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: expectedLab.type })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: expectedLab.status })).toBeInTheDocument()
      expect(
        screen.getByRole('cell', {
          name: format(new Date(expectedLab.requestedOn), 'yyyy-MM-dd hh:mm a'),
        }),
      ).toBeInTheDocument()
    })

    it('should navigate to the lab when the view button is clicked', async () => {
      const { history, expectedLab } = setup([Permissions.ViewLabs, Permissions.RequestLab])

      userEvent.click(await screen.findByRole('button', { name: /actions.view/i }))

      await waitFor(() => {
        expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
      })
    })
  })

  describe('dropdown', () => {
    it('should search for labs when dropdown changes', async () => {
      const expectedStatus = 'requested'
      setup([Permissions.ViewLabs])

      userEvent.type(
        screen.getByRole('combobox'),
        `{selectall}{backspace}${expectedStatus}{arrowdown}{enter}`,
      )

      expect(LabRepository.search).toHaveBeenCalledTimes(2)
      expect(LabRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({ status: expectedStatus }),
      )
    })
  })

  describe('search functionality', () => {
    it('should search for labs after the search text has not changed for 500 milliseconds', async () => {
      jest.useFakeTimers()
      setup([Permissions.ViewLabs])

      const expectedSearchText = 'search text'
      userEvent.type(screen.getByRole('textbox', { name: /labs.search/i }), expectedSearchText)

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(LabRepository.search).toHaveBeenCalledTimes(1)
      expect(LabRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({ text: expectedSearchText }),
      )
    })
  })
})
