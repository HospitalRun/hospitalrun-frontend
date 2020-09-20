import { Button, Typeahead, Label } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
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

describe('New Medication Request', () => {
  const setup = async (
    store = mockStore({ medication: { status: 'loading', error: {} } } as any),
  ) => {
    const history = createMemoryHistory()
    history.push(`/medications/new`)
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    const wrapper: ReactWrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <titleUtil.TitleProvider>
            <NewMedicationRequest />
          </titleUtil.TitleProvider>
        </Router>
      </Provider>,
    )

    wrapper.find(NewMedicationRequest).props().updateTitle = jest.fn()
    wrapper.update()
    return { wrapper }
  }

  describe('form layout', () => {
    it('should have called the useUpdateTitle hook', async () => {
      await setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })

    it('should render a patient typeahead', async () => {
      const { wrapper } = await setup()
      const typeaheadDiv = wrapper.find('.patient-typeahead')

      expect(typeaheadDiv).toBeDefined()

      const label = typeaheadDiv.find(Label)
      const typeahead = typeaheadDiv.find(Typeahead)

      expect(label).toBeDefined()
      expect(label.prop('text')).toEqual('medications.medication.patient')
      expect(typeahead).toBeDefined()
      expect(typeahead.prop('placeholder')).toEqual('medications.medication.patient')
      expect(typeahead.prop('searchAccessor')).toEqual('fullName')
    })

    it('should render a medication input box', async () => {
      const { wrapper } = await setup()
      const typeInputBox = wrapper.find(TextInputWithLabelFormGroup).at(0)

      expect(typeInputBox).toBeDefined()
      expect(typeInputBox.prop('label')).toEqual('medications.medication.medication')
      expect(typeInputBox.prop('isRequired')).toBeTruthy()
      expect(typeInputBox.prop('isEditable')).toBeTruthy()
    })

    it('should render a notes text field', async () => {
      const { wrapper } = await setup()
      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('medications.medication.notes')
      expect(notesTextField.prop('isRequired')).toBeFalsy()
      expect(notesTextField.prop('isEditable')).toBeTruthy()
    })

    it('should render a save button', async () => {
      const { wrapper } = await setup()
      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton).toBeDefined()
      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', async () => {
      const { wrapper } = await setup()
      const cancelButton = wrapper.find(Button).at(1)
      expect(cancelButton).toBeDefined()
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('on cancel', async () => {
    const history = createMemoryHistory()
    const { wrapper } = await setup()

    it('should navigate back to /medications', () => {
      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(history.location.pathname).toEqual('/medications')
    })
  })

  describe('on save', async () => {
    const history = createMemoryHistory()
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
    const { wrapper } = await setup(store)
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
      const patientTypeahead = wrapper.find(Typeahead)
      await act(async () => {
        const onChange = patientTypeahead.prop('onChange')
        await onChange([{ id: expectedMedication.patient }] as Patient[])
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
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick()
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
