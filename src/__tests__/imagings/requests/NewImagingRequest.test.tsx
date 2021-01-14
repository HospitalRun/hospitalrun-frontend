import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import selectEvent from 'react-select-event'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewImagingRequest from '../../../imagings/requests/NewImagingRequest'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import { RootState } from '../../../shared/store'
import { UserState, LoginError } from '../../../user/user-slice'
import { expectOneConsoleError } from '../../test-utils/console.utils'

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Imaging Request', () => {
  let history: any
  let setButtonToolBarSpy: any

  const setup = () => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/imaging/new`)
    const store = mockStore({
      user: {
        fullName: 'test',
        permissions: [],
        loginError: {} as LoginError,
      } as UserState,
    } as any)

    return render(
      <ButtonBarProvider.ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/imaging/new">
              <titleUtil.TitleProvider>
                <NewImagingRequest />
              </titleUtil.TitleProvider>
            </Route>
          </Router>
        </Provider>
      </ButtonBarProvider.ButtonBarProvider>,
    )
  }

  describe('form layout', () => {
    it('Renders a patient input field with correct label', () => {
      setup()
      const imgPatientInput = screen.getByPlaceholderText(/imagings\.imaging\.patient/i)

      expect(screen.getAllByText(/imagings\.imaging\.patient/i)[0]).toBeInTheDocument()

      userEvent.type(imgPatientInput, 'Cmdr. Data')
      expect(imgPatientInput).toHaveDisplayValue('Cmdr. Data')
    })

    it('Renders a dropdown list of visits', async () => {
      setup()
      const dropdownVisits = within(screen.getByTestId('visitSelect')).getByRole('combobox')
      expect(screen.getByText(/patient\.visits\.label/i)).toBeInTheDocument()
      expect(dropdownVisits.getAttribute('aria-expanded')).toBe('false')

      selectEvent.openMenu(dropdownVisits)
      expect(dropdownVisits).toHaveDisplayValue([''])
      expect(dropdownVisits.getAttribute('aria-expanded')).toBe('true')
    })

    it('Renders an image type input box', async () => {
      setup()
      const imgTypeInput = screen.getByLabelText(/imagings\.imaging\.type/i)
      expect(screen.getByText(/imagings\.imaging\.type/i)).toBeInTheDocument()

      userEvent.type(imgTypeInput, 'tricorder imaging')
      expect(imgTypeInput).toHaveDisplayValue('tricorder imaging')
    })

    it('Renders a status types select input field', async () => {
      setup()
      const dropdownStatusTypes = within(screen.getByTestId('statusSelect')).getByRole('combobox')
      expect(screen.getByText(/patient\.visits\.label/i)).toBeInTheDocument()

      expect(dropdownStatusTypes.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(dropdownStatusTypes)
      expect(dropdownStatusTypes.getAttribute('aria-expanded')).toBe('true')
      expect(dropdownStatusTypes).toHaveDisplayValue(['imagings.status.requested'])

      const optionsContent = screen
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)
      expect(
        optionsContent.includes(
          'imagings.status.requested' && 'imagings.status.completed' && 'imagings.status.canceled',
        ),
      ).toBe(true)
    })

    it('Renders a notes text field', async () => {
      setup()
      const notesInputField = screen.getByRole('textbox', {
        name: /imagings\.imaging\.notes/i,
      })
      expect(screen.getByLabelText(/imagings\.imaging\.notes/i)).toBeInTheDocument()
      expect(notesInputField).toBeInTheDocument()
      userEvent.type(notesInputField, 'Spot likes nutritional formula 221')
    })
  })

  describe('on cancel', () => {
    it('Navigate back to /imaging', async () => {
      setup()
      expect(history.location.pathname).toEqual('/imaging/new')
      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      )

      expect(history.location.pathname).toEqual('/imaging')
    })
  })

  describe('on save', () => {
    it('Save the imaging request and navigate to "/imaging"', async () => {
      expectOneConsoleError({ patient: 'imagings.requests.error.patientRequired' })
      setup()
      const patient = screen.getByPlaceholderText(/imagings\.imaging\.patient/i)
      const imgTypeInput = screen.getByLabelText(/imagings\.imaging\.type/i)
      const notesInputField = screen.getByRole('textbox', {
        name: /imagings\.imaging\.notes/i,
      })
      const dropdownStatusTypes = within(screen.getByTestId('statusSelect')).getByRole('combobox')
      const dropdownVisits = within(screen.getByTestId('visitSelect')).getByRole('combobox')
      userEvent.type(patient, 'Worf')
      userEvent.type(imgTypeInput, 'Medical Tricorder')
      userEvent.type(notesInputField, 'Batliff')
      selectEvent.create(dropdownVisits, 'Med Bay')
      selectEvent.select(dropdownStatusTypes, 'imagings.status.requested')
      userEvent.click(
        screen.getByRole('button', {
          name: /imagings\.requests\.create/i,
        }),
      )

      expect(history.location.pathname).toEqual(`/imaging/new`)
    })
  })
})
