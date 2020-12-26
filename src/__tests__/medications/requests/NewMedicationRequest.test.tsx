import { Button, Typeahead } from '@hospitalrun/components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
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

    it('should render a medication input box with label', () => {
      setup()
      expect(screen.getByText(/medications\.medication\.medication/i)).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/medications\.medication\.medication/i),
      ).toBeInTheDocument()
    })

    it('should render a notes text field', () => {
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

  describe.skip('on cancel', () => {
    it('should navigate back to /medications', async () => {
      const { wrapper } = setup()
      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick({} as React.MouseEvent<HTMLButtonElement>)
      })

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
          { id: expectedMedication.patient, fullName: 'some full name' },
        ] as Patient[])
    })

    it('should save the medication request and navigate to "/medications/:id"', async () => {
      const { wrapper } = setup(store)

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
