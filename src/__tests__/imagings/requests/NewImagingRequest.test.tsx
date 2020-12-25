import { render, screen } from '@testing-library/react'
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

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Imaging Request', () => {
  let history: any
  let setButtonToolBarSpy: any

  const setup = () => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/imaging/new`)
    const store = mockStore({} as any)

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

  // ? Does the TitleComponent/Provider and Breadcrumb have its own tests
  // describe('title and breadcrumbs', () => {
  //   it(' have called the useUpdateTitle hook', async () => {
  //     await setup()
  //     expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
  //   })
  // })

  describe('form layout', () => {
    it('Patient input field w/ label', () => {
      setup()
      const imgPatientInput = screen.getByPlaceholderText(/imagings\.imaging\.patient/i)

      expect(screen.getAllByText(/imagings\.imaging\.patient/i)[0]).toBeInTheDocument()

      userEvent.type(imgPatientInput, 'Cmdr. Data')
      expect(imgPatientInput).toHaveDisplayValue('Cmdr. Data')
    })

    it('Render a dropdown list of visits', async () => {
      setup()
      const dropdownVisits = screen.getAllByPlaceholderText('-- Choose --')[0]
      expect(screen.getByText(/patient\.visits\.label/i)).toBeInTheDocument()
      expect(dropdownVisits.getAttribute('aria-expanded')).toBe('false')

      selectEvent.openMenu(dropdownVisits)
      expect(dropdownVisits).toHaveDisplayValue([''])
      expect(dropdownVisits.getAttribute('aria-expanded')).toBe('true')
    })

    it('Render a image type input box', async () => {
      setup()
      const imgTypeInput = screen.getByPlaceholderText(/imagings\.imaging\.type/i)
      expect(screen.getByLabelText(/imagings\.imaging\.type/i)).toBeInTheDocument()

      userEvent.type(imgTypeInput, 'tricorder imaging')
      expect(imgTypeInput).toHaveDisplayValue('tricorder imaging')
    })

    it('Render a status types select', async () => {
      setup()
      const dropdownStatusTypes = screen.getAllByPlaceholderText('-- Choose --')[1]
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

    it('Render a notes text field', async () => {
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
      setup()
      const patient = screen.getByPlaceholderText(/imagings\.imaging\.patient/i)
      const imgTypeInput = screen.getByPlaceholderText(/imagings.imaging.type/i)
      const notesInputField = screen.getByRole('textbox', {
        name: /imagings\.imaging\.notes/i,
      })
      const dropdownStatusTypes = screen.getAllByPlaceholderText('-- Choose --')[1]
      const dropdownVisits = screen.getAllByPlaceholderText('-- Choose --')[0]
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
