import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
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

describe('Report Incident', () => {
  let history: any

  beforeEach(() => {
    jest.resetAllMocks()
  })

  let setButtonToolBarSpy: any
  const setup = (permissions: Permissions[]) => {
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

    return render(
      <ButtonBarProvider.ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/incidents/new">
              <titleUtil.TitleProvider>
                <ReportIncident />
              </titleUtil.TitleProvider>
            </Route>
          </Router>
        </Provider>
      </ButtonBarProvider.ButtonBarProvider>,
    )
  }
  it('renders a department form element that allows user input', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const departmentInput = screen.getByLabelText(/incidents\.reports\.department/i)

    expect(departmentInput).toBeEnabled()
    expect(departmentInput).toBeInTheDocument()

    userEvent.type(departmentInput, 'Engineering Bay')
    expect(departmentInput).toHaveDisplayValue('Engineering Bay')
  })

  it('renders a category form element that allows user input', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const categoryInput = screen.getByLabelText(/incidents\.reports\.category\b/i)

    expect(categoryInput).toBeEnabled()
    expect(categoryInput).toBeInTheDocument()

    userEvent.type(categoryInput, 'Warp Engine')
    expect(categoryInput).toHaveDisplayValue('Warp Engine')
  })

  it('renders a category item form element that allows user input', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const categoryItemInput = screen.getByLabelText(/incidents\.reports\.categoryitem/i)

    expect(categoryItemInput).toBeInTheDocument()
    expect(categoryItemInput).toBeEnabled()

    userEvent.type(categoryItemInput, 'Warp Coil')
    expect(categoryItemInput).toHaveDisplayValue('Warp Coil')
  })

  it('renders a description formField element that allows user input', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const descriptionInput = screen.getByLabelText(/incidents\.reports\.description/i)

    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toBeEnabled()

    userEvent.type(descriptionInput, 'Geordi requested analysis')
    expect(descriptionInput).toHaveDisplayValue('Geordi requested analysis')
  })

  // ! Remove test? Save button is always rendered regardless of input values
  // it(' renders action save button after all the input fields are filled out', async () => {
  //   setup([Permissions.ViewIncident, Permissions.ResolveIncident])

  //   expect(screen.queryByRole('button', { name: /incidents\.reports\.new/i })).not.toBeInTheDocument()
  //   const departmentInput = screen.getByLabelText(/incidents\.reports\.department/i)
  //   const categoryInput = screen.getByLabelText(/incidents\.reports\.category\b/i)
  //   const categoryItemInput = screen.getByLabelText(/incidents\.reports\.categoryitem/i)
  //   const descriptionInput = screen.getByLabelText(/incidents\.reports\.description/i)

  //   userEvent.type(departmentInput, 'Engineering Bay')
  //   userEvent.type(categoryInput, 'Warp Engine')
  //   userEvent.type(categoryItemInput, 'Warp Coil')
  //   userEvent.type(descriptionInput, 'Geordi requested analysis')

  //   userEvent.click(
  //     screen.getByRole('button', {
  //       name: /incidents\.reports\.new/i,
  //     }),
  //   )
  // })

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
    const { container } = setup([Permissions.ReportIncident])

    userEvent.click(
      screen.getByRole('button', {
        name: /incidents\.reports\.new/i,
      }),
    )

    const departmentInput = screen.getByLabelText(/incidents\.reports\.department/i)
    const categoryInput = screen.getByLabelText(/incidents\.reports\.category\b/i)
    const categoryItemInput = screen.getByLabelText(/incidents\.reports\.categoryitem/i)
    const descriptionInput = screen.getByLabelText(/incidents\.reports\.description/i)
    const dateInput = within(await screen.findByTestId('dateOfIncidentDateTimePicker')).getByRole(
      'textbox',
    )

    const invalidInputs = container.querySelectorAll('.is-invalid')
    expect(invalidInputs).toHaveLength(5)

    expect(dateInput).toHaveClass('is-invalid')

    expect(departmentInput).toHaveClass('is-invalid')

    expect(categoryInput).toHaveClass('is-invalid')

    expect(categoryItemInput).toHaveClass('is-invalid')

    expect(descriptionInput).toHaveClass('is-invalid')
  })

  describe('on cancel', () => {
    it('should navigate to /incidents', async () => {
      setup([Permissions.ReportIncident])

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
