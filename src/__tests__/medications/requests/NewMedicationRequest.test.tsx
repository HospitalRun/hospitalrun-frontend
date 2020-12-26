import { Button, Typeahead } from '@hospitalrun/components'
import { render, screen } from '@testing-library/react'
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
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import PatientRepository from '../../../shared/db/PatientRepository'
import Medication from '../../../shared/model/Medication'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const { TitleProvider } = titleUtil
describe('New Medication Request', () => {
  let history: any

  const setup = (store = mockStore({ medication: { status: 'loading', error: {} } } as any)) => {
    history = createMemoryHistory()
    history.push(`/medications/new`)
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    const Wrapper: React.FC = ({ children }: any) => (
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>{children}</TitleProvider>
        </Router>
      </Provider>
    )
    return render(<NewMedicationRequest />, { wrapper: Wrapper })
  }

  describe('form layout', () => {
    it('should have called the useUpdateTitle hook', () => {
      setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })

    it('should render a patient typeahead', () => {
      setup()

      // find label for Typeahead component
      expect(screen.getAllByText(/medications\.medication\.patient/i)[0]).toBeInTheDocument()

      const medInput = screen.getByPlaceholderText(/medications\.medication\.patient/i)

      userEvent.type(medInput, 'Bruce Wayne')
      expect(medInput).toHaveDisplayValue('Bruce Wayne')
    })

    it('should render a medication input box with label', async () => {
      setup()
      expect(screen.getByText(/medications\.medication\.medication/i)).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/medications\.medication\.medication/i),
      ).toBeInTheDocument()
    })

    it('render medication request status options', async () => {
      setup()
      const medStatus = screen.getAllByPlaceholderText('-- Choose --')[0]

      expect(screen.getByText(/medications\.medication\.status/i)).toBeInTheDocument()

      expect(medStatus.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medStatus)
      expect(medStatus.getAttribute('aria-expanded')).toBe('true')
      expect(medStatus).toHaveDisplayValue(/medications\.status\.draft/i)

      const statusOptions = screen
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        statusOptions.includes('medications.status.draft' && 'medications.status.active'),
      ).toBe(true)
    })

    it('render medication intent options', async () => {
      setup()
      const medicationIntent = screen.getAllByPlaceholderText('-- Choose --')[1]

      expect(screen.getByText(/medications\.medication\.intent/i)).toBeInTheDocument()

      expect(medicationIntent.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medicationIntent)
      expect(medicationIntent.getAttribute('aria-expanded')).toBe('true')
      expect(medicationIntent).toHaveDisplayValue(/medications\.intent\.proposal/i)

      const statusOptions = screen
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        statusOptions.includes(
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
      const medicationPriority = screen.getAllByPlaceholderText('-- Choose --')[2]

      expect(screen.getByText(/medications\.medication\.status/i)).toBeInTheDocument()

      expect(medicationPriority.getAttribute('aria-expanded')).toBe('false')
      selectEvent.openMenu(medicationPriority)
      expect(medicationPriority.getAttribute('aria-expanded')).toBe('true')
      expect(medicationPriority).toHaveDisplayValue('medications.priority.routine')

      const statusOptions = screen
        .getAllByRole('option')
        .map((option) => option.lastElementChild?.innerHTML)

      expect(
        statusOptions.includes(
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
      setup()
      expect(history.location.pathname).toEqual('/medications/new')
      const cancelButton = screen.getByRole('button', {
        name: /actions\.cancel/i,
      })

      userEvent.click(cancelButton)

      expect(history.location.pathname).toEqual('/medications')
    })
  })

  describe.skip('on save', () => {
    let medicationRepositorySaveSpy: any
    const expectedDate = new Date()
    const expectedMedication = {
      patient: '12345',
      medication: 'expected medication',
      status: 'draft',
      notes: 'expected notes',
      id: '1234',
      requestedOn: expectedDate.toISOString(),
    } as Medication
    const store = mockStore({
      medication: { status: 'loading', error: {} },
      user: { user: { id: 'fake id' } },
    } as any)
    beforeEach(() => {
      jest.resetAllMocks()
      Date.now = jest.fn(() => expectedDate.valueOf())
      medicationRepositorySaveSpy = jest
        .spyOn(MedicationRepository, 'save')
        .mockResolvedValue(expectedMedication as Medication)

      jest
        .spyOn(PatientRepository, 'search')
        .mockResolvedValue([
          { id: expectedMedication.patient, fullName: 'Barry Allen' },
        ] as Patient[])
    })

    it.skip('should save the medication request and navigate to "/medications/:id"', async () => {
      setup(store)

      const patientTypeahead = wrapper.find(Typeahead)
      act(async () => {
        const onChange = patientTypeahead.prop('onChange')
        onChange([{ id: expectedMedication.patient }] as Patient[])
      })

      const medicationInput = wrapper.find(TextInputWithLabelFormGroup).at(0)
      act(() => {
        const onChange = medicationInput.prop('onChange') as any
        onChange({ currentTarget: { value: expectedMedication.medication } })
      })

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)
      act(() => {
        const onChange = notesTextField.prop('onChange') as any
        onChange({ currentTarget: { value: expectedMedication.notes } })
      })
      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      act(async () => {
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })

      expect(medicationRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(medicationRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          patient: expectedMedication.patient,
          medication: expectedMedication.medication,
          notes: expectedMedication.notes,
          status: 'draft',
          requestedOn: expectedDate.toISOString(),
        }),
      )
      expect(history.location.pathname).toEqual(`/medications/${expectedMedication.id}`)
    })
  })
})
