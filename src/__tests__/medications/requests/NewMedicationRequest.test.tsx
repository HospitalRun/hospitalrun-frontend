import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import selectEvent from 'react-select-event'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewMedicationRequest from '../../../medications/requests/NewMedicationRequest'
import * as titleUtil from '../../../page-header/title/TitleContext'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const { TitleProvider } = titleUtil

const setup = (store = mockStore({ medication: { status: 'loading', error: {} } } as any)) => {
  jest.resetAllMocks()

  const history = createMemoryHistory()
  history.push(`/medications/new`)

  return {
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>
            <NewMedicationRequest />
          </TitleProvider>
        </Router>
      </Provider>,
    ),
  }
}

describe('New Medication Request', () => {
  describe('form layout', () => {
    it('should render a patient typeahead', () => {
      setup()

      expect(screen.getByText(/medications\.medication\.patient/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/medications\.medication\.patient/i)).toBeInTheDocument()
    })

    it('should render a medication input box with label', async () => {
      setup()

      expect(screen.getByText(/medications\.medication\.medication/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/medications\.medication\.medication/i)).toBeInTheDocument()
    })

    it('render medication request status options', async () => {
      setup()

      const medStatus = within(screen.getByTestId('statusSelect')).getByRole('combobox')

      expect(screen.getByText(/medications\.medication\.status/i)).toBeInTheDocument()
      expect(medStatus.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medStatus)
      expect(medStatus.getAttribute('aria-expanded')).toBe('true')
      expect(medStatus).toHaveDisplayValue(/medications\.status\.draft/i)

      const statusOptions = within(screen.getByTestId('statusSelect'))
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        statusOptions.includes('medications.status.draft' && 'medications.status.active'),
      ).toBe(true)
    })

    it('render medication intent options', async () => {
      setup()

      const medicationIntent = within(screen.getByTestId('intentSelect')).getByRole('combobox')

      expect(screen.getByText(/medications\.medication\.intent/i)).toBeInTheDocument()
      expect(medicationIntent.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medicationIntent)
      expect(medicationIntent.getAttribute('aria-expanded')).toBe('true')
      expect(medicationIntent).toHaveDisplayValue(/medications\.intent\.proposal/i)

      const intentOptions = within(screen.getByTestId('intentSelect'))
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        intentOptions.includes(
          'medications.intent.proposal' &&
            'medications.intent.plan' &&
            'medications.intent.order' &&
            'medications.intent.originalOrder' &&
            'medications.intent.reflexOrder' &&
            'medications.intent.fillerOrder' &&
            'medications.intent.instanceOrder' &&
            'medications.intent.option',
        ),
      ).toBe(true)
    })

    it('render medication priorty select options', async () => {
      setup()

      const medicationPriority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')

      expect(screen.getByText(/medications\.medication\.status/i)).toBeInTheDocument()
      expect(medicationPriority.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medicationPriority)
      expect(medicationPriority.getAttribute('aria-expanded')).toBe('true')
      expect(medicationPriority).toHaveDisplayValue('medications.priority.routine')

      const priorityOptions = within(screen.getByTestId('prioritySelect'))
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        priorityOptions.includes(
          'medications.priority.routine' &&
            'medications.priority.urgent' &&
            'medications.priority.asap' &&
            'medications.priority.stat',
        ),
      ).toBe(true)
    })

    it('should render a notes text field', async () => {
      setup()

      const medicationNotes = screen.getByRole('textbox', {
        name: /medications\.medication\.notes/i,
      })

      expect(screen.getByLabelText(/medications\.medication\.notes/i)).toBeInTheDocument()
      expect(medicationNotes).toBeInTheDocument()
      userEvent.type(medicationNotes, 'Bruce Wayne is batman')
      expect(medicationNotes).toHaveValue('Bruce Wayne is batman')
    })

    it('should render a save button', () => {
      setup()

      expect(
        screen.getByRole('button', {
          name: /medications\.requests\.new/i,
        }),
      ).toBeInTheDocument()
    })

    it('should render a cancel button', () => {
      setup()

      expect(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      ).toBeInTheDocument()
    })
  })

  describe('on cancel', () => {
    it('should navigate back to /medications', async () => {
      const { history } = setup()

      const cancelButton = screen.getByRole('button', {
        name: /actions\.cancel/i,
      })

      expect(history.location.pathname).toEqual('/medications/new')
      userEvent.click(cancelButton)
      expect(history.location.pathname).toEqual('/medications')
    })
  })

  describe('on save', () => {
    it('should save the medication request and navigate to "/medications/:id"', async () => {
      const { history } = setup()

      jest.spyOn(PatientRepository, 'search').mockResolvedValue([
        {
          id: 'batman',
          fullName: 'Bruce Wayne',
          code: 'test code',
        } as Patient,
      ])

      const patient = screen.getByPlaceholderText(/medications\.medication\.patient/i)
      const medication = screen.getByLabelText(/medications\.medication\.medication/i)
      const medicationNotes = screen.getByRole('textbox', {
        name: /medications\.medication\.notes/i,
      })
      const medStatus = within(screen.getByTestId('statusSelect')).getByRole('combobox')
      const medicationIntent = within(screen.getByTestId('intentSelect')).getByRole('combobox')
      const medicationPriority = within(screen.getByTestId('prioritySelect')).getByRole('combobox')
      const quantityValue = screen.getByLabelText(/quantityValue/)
      const quantityUnit = screen.getByLabelText(/quantityUnit/)

      userEvent.type(patient, 'Bruce')
      await selectEvent.select(patient, /Bruce/)
      userEvent.type(medication, 'Ibuprofen')
      userEvent.type(medicationNotes, 'Be warned he is Batman')
      await selectEvent.select(medStatus, /active/)
      await selectEvent.select(medicationIntent, /order/)
      await selectEvent.select(medicationPriority, /urgent/)
      userEvent.type(quantityUnit, '200')
      userEvent.type(quantityValue, 'mg')
      userEvent.click(
        screen.getByRole('button', {
          name: /medications\.requests\.new/i,
        }),
      )

      await waitFor(() => {
        expect(history.location.pathname).toMatch(
          /\/medications\/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{11}/,
        )
      })

      expect(medStatus).toHaveValue('medications.status.active')
      expect(medicationIntent).toHaveValue('medications.intent.order')
      expect(medicationPriority).toHaveValue('medications.priority.urgent')
      expect(quantityUnit).toHaveValue('200')
      expect(quantityValue).toHaveValue('mg')
    }, 20000)
  })
})
