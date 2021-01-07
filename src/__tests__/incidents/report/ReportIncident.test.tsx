import { render as rtlRender, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ReportIncident from '../../../incidents/report/ReportIncident'
import * as validationUtil from '../../../incidents/util/validate-incident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'
import { expectOneConsoleError } from '../../test-utils/console.utils'

const mockStore = createMockStore<RootState, any>([thunk])

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

describe('Report Incident', () => {
  let history: any

  beforeEach(() => {
    jest.resetAllMocks()
  })

  let setButtonToolBarSpy: any
  const render = (permissions: Permissions[]) => {
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/incidents/new`)
    const store = mockStore({
      user: {
        permissions,
        user: {
          id: 'some id',
        },
      },
    } as any)

    function Wrapper({ children }: WrapperProps) {
      return (
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/incidents/new">
                <titleUtil.TitleProvider> {children} </titleUtil.TitleProvider>
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>
      )
    }

    return rtlRender(<ReportIncident />, { wrapper: Wrapper })
  }
  test('type into department field', async () => {
    render([Permissions.ViewIncident, Permissions.ResolveIncident])
    const depInput = await screen.findByPlaceholderText(/incidents\.reports\.department/i)

    expect(depInput).toBeEnabled()
    expect(depInput).toBeInTheDocument()

    userEvent.type(depInput, 'Engineering Bay')
    expect(depInput).toHaveDisplayValue('Engineering Bay')
  })

  test('type into category field', async () => {
    render([Permissions.ViewIncident, Permissions.ResolveIncident])
    const catInput = await screen.findByPlaceholderText(/incidents\.reports\.category\b/i)

    expect(catInput).toBeEnabled()
    expect(catInput).toBeInTheDocument()

    userEvent.type(catInput, 'Warp Engine')
    expect(catInput).toHaveDisplayValue('Warp Engine')
  })

  test('type into category item field', async () => {
    render([Permissions.ViewIncident, Permissions.ResolveIncident])
    const catItemInput = await screen.findByPlaceholderText(/incidents\.reports\.categoryitem/i)

    expect(catItemInput).toBeInTheDocument()
    expect(catItemInput).toBeEnabled()

    userEvent.type(catItemInput, 'Warp Coil')
    expect(catItemInput).toHaveDisplayValue('Warp Coil')
  })

  test('type into description field', async () => {
    render([Permissions.ViewIncident, Permissions.ResolveIncident])
    const inputArr = await screen.findAllByRole('textbox', { name: /required/i })
    const descInput = inputArr[inputArr.length - 1]

    expect(descInput).toBeInTheDocument()
    expect(descInput).toBeEnabled()

    userEvent.type(descInput, 'Geordi requested analysis')
    expect(descInput).toHaveDisplayValue('Geordi requested analysis')
  })
  test('action save after all the input fields are filled out', async () => {
    render([Permissions.ViewIncident, Permissions.ResolveIncident])
    const depInput = await screen.findByPlaceholderText(/incidents\.reports\.department/i)
    const catInput = await screen.findByPlaceholderText(/incidents\.reports\.category\b/i)
    const catItemInput = await screen.findByPlaceholderText(/incidents\.reports\.categoryitem/i)
    const inputArr = await screen.findAllByRole('textbox', { name: /required/i })
    const descInput = inputArr[inputArr.length - 1]

    userEvent.type(depInput, 'Engineering Bay')
    userEvent.type(catInput, 'Warp Engine')
    userEvent.type(catItemInput, 'Warp Coil')
    userEvent.type(descInput, 'Geordi requested analysis')

    userEvent.click(
      screen.getByRole('button', {
        name: /incidents\.reports\.new/i,
      }),
    )
  })

  it('should display errors if validation fails', async () => {
    const error = {
      name: 'incident error',
      message: 'something went wrong',
      date: 'some date error',
      department: 'some department error',
      category: 'some category error',
      categoryItem: 'some category item error',
      description: 'some description error',
    }
    expectOneConsoleError(error)
    jest.spyOn(validationUtil, 'default').mockReturnValue(error)
    render([Permissions.ReportIncident])

    userEvent.click(
      screen.getByRole('button', {
        name: /incidents\.reports\.new/i,
      }),
    )

    const depInput = await screen.findByPlaceholderText(/incidents\.reports\.department/i)
    const catInput = await screen.findByPlaceholderText(/incidents\.reports\.category\b/i)
    const catItemInput = await screen.findByPlaceholderText(/incidents\.reports\.categoryitem/i)
    const inputArr = await screen.findAllByRole('textbox')
    const descInput = inputArr[inputArr.length - 2]
    const dateInput = inputArr[0]

    screen.debug(undefined, Infinity)

    expect(dateInput).toHaveClass('is-invalid')

    expect(depInput).toHaveClass('is-invalid')

    expect(catInput).toHaveClass('is-invalid')

    expect(catItemInput).toHaveClass('is-invalid')

    expect(descInput).toHaveClass('is-invalid')
  })

  describe('on cancel', () => {
    it('should navigate to /incidents', () => {
      render([Permissions.ReportIncident])

      expect(history.location.pathname).toBe('/incidents/new')

      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      )

      expect(history.location.pathname).toBe('/incidents')
    })
  })
})
