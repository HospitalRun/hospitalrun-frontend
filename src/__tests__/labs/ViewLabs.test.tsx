import { render, screen, waitFor } from '@testing-library/react'
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

  const history = createMemoryHistory()

  const store = mockStore({
    title: '',
    user: {
      permissions,
    },
  } as any)

  return {
    expectedLab,
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <ButtonBarProvider.ButtonBarProvider>
            <ButtonToolbar />
            <titleUtil.TitleProvider>
              <ViewLabs />
            </titleUtil.TitleProvider>
          </ButtonBarProvider.ButtonBarProvider>
        </Router>
      </Provider>,
    ),
  }
}

describe('View Labs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('button bar', () => {
    it('should display button to add new lab request', async () => {
      setup([Permissions.ViewLab, Permissions.RequestLab])

      expect(
        await screen.findByRole('button', { name: /labs\.requests\.new/i }),
      ).toBeInTheDocument()
    })

    it('should not display button to add new lab request if the user does not have permissions', async () => {
      setup([Permissions.ViewLabs])

      expect(screen.queryByRole('button', { name: /labs\.requests\.new/i })).not.toBeInTheDocument()
    })
  })

  describe('table', () => {
    it('should render a table with data', async () => {
      const { expectedLab } = setup([Permissions.ViewLabs, Permissions.RequestLab])

      const headers = await screen.findAllByRole('columnheader')
      const cells = screen.getAllByRole('cell')

      expect(headers[0]).toHaveTextContent(/labs\.lab\.code/i)
      expect(headers[1]).toHaveTextContent(/labs\.lab\.type/i)
      expect(headers[2]).toHaveTextContent(/labs\.lab\.requestedOn/i)
      expect(headers[3]).toHaveTextContent(/labs\.lab\.status/i)
      expect(cells[0]).toHaveTextContent(expectedLab.code)
      expect(cells[1]).toHaveTextContent(expectedLab.type)
      expect(cells[2]).toHaveTextContent(
        format(new Date(expectedLab.requestedOn), 'yyyy-MM-dd hh:mm a'),
      )
      expect(cells[3]).toHaveTextContent(expectedLab.status)
      expect(screen.getByRole('button', { name: /actions.view/i })).toBeInTheDocument()
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
      expect(screen.getByRole('combobox')).toHaveValue('labs.status.requested')
    })
  })

  describe('search functionality', () => {
    it('should search for labs after the search text has not changed for 500 milliseconds', async (): Promise<void> => {
      const expectedLab2 = {
        code: 'L-5678',
        id: '5678',
        type: 'another type 2 phaser',
        patient: 'patientIdB',
        status: 'requested',
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Lab
      const { expectedLab } = setup([Permissions.ViewLabs, Permissions.RequestLab])
      jest.spyOn(LabRepository, 'search').mockResolvedValue([expectedLab2])

      expect(await screen.findByRole('cell', { name: expectedLab.code })).toBeInTheDocument()

      await userEvent.type(screen.getByRole('textbox', { name: /labs.search/i }), 'Picard', {
        delay: 100,
      })
      expect(screen.getByRole('textbox', { name: /labs.search/i })).toHaveDisplayValue(/picard/i)
      expect(await screen.findByText(/phaser/i)).toBeInTheDocument()
      expect(screen.queryByRole('cell', { name: expectedLab.code })).not.toBeInTheDocument()
    })
  })
})
