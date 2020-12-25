import { render, screen, act } from '@testing-library/react'
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
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import Lab from '../../shared/model/Lab'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Labs', () => {
  let history: any
  const setButtonToolBarSpy = jest.fn()
  jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

  const setup = async (permissions: Permissions[] = []) => {
    history = createMemoryHistory()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
    } as any)

    return render(
      <ButtonBarProvider.ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <titleUtil.TitleProvider>
              <ViewLabs />
            </titleUtil.TitleProvider>
          </Router>
        </Provider>
      </ButtonBarProvider.ButtonBarProvider>,
    )
  }

  describe('title', () => {
    it('should have called the useUpdateTitle hook', async () => {
      setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
    })
  })

  describe('button bar', () => {
    beforeEach(() => {
      setButtonToolBarSpy.mockReset()
    })

    it('should display button to add new lab request', async () => {
      setup([Permissions.ViewLab, Permissions.RequestLab])

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('labs.requests.new')
    })

    it('should not display button to add new lab request if the user does not have permissions', async () => {
      setup([Permissions.ViewLabs])

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('table', () => {
    const expectedLab = {
      code: 'L-1234',
      id: '1234',
      type: 'lab type',
      patient: 'patientId',
      status: 'requested',
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as Lab

    jest.spyOn(LabRepository, 'findAll').mockResolvedValue([expectedLab])

    it('should render a table with data', async () => {
      await setup([Permissions.ViewLabs, Permissions.RequestLab])
      expect(screen.getByRole('columnheader', { name: /labs.lab.code/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /labs.lab.type/i })).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /labs.lab.requestedOn/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /labs.lab.status/i })).toBeInTheDocument()
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
      await setup([Permissions.ViewLabs, Permissions.RequestLab])
      userEvent.click(screen.getByRole('button', { name: /actions.view/i }))
      expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
    })
  })

  describe('dropdown', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      searchLabsSpy.mockClear()
    })

    it('should search for labs when dropdown changes', async () => {
      const expectedStatus = 'requested'
      await setup([Permissions.ViewLabs])

      userEvent.type(
        screen.getByRole('combobox'),
        `{selectall}{backspace}${expectedStatus}{arrowdown}{enter}`,
      )

      expect(searchLabsSpy).toHaveBeenCalledTimes(2)
      expect(searchLabsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ status: expectedStatus }),
      )
    })
  })

  describe('search functionality', () => {
    const searchLabsSpy = jest.spyOn(LabRepository, 'search')

    beforeEach(() => {
      searchLabsSpy.mockClear()
    })

    it('should search for labs after the search text has not changed for 500 milliseconds', async () => {
      jest.useFakeTimers()
      await setup([Permissions.ViewLabs])

      const expectedSearchText = 'search text'
      userEvent.type(screen.getByRole('textbox', { name: /labs.search/i }), expectedSearchText)

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(searchLabsSpy).toHaveBeenCalledTimes(1)
      expect(searchLabsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ text: expectedSearchText }),
      )
    })
  })
})
