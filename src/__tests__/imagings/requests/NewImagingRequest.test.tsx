import { Button, Typeahead, Label, Alert } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewImagingRequest from '../../../imagings/requests/NewImagingRequest'
import * as titleUtil from '../../../page-header/title/useTitle'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import Imaging from '../../../shared/model/Imaging'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Imaging Request', () => {
  describe('title and breadcrumbs', () => {
    let titleSpy: any
    const history = createMemoryHistory()

    beforeEach(() => {
      const store = mockStore({ title: '', imaging: { status: 'loading', error: {} } } as any)
      titleSpy = jest.spyOn(titleUtil, 'default')
      history.push('/imagings/new')

      mount(
        <Provider store={store}>
          <Router history={history}>
            <NewImagingRequest />
          </Router>
        </Provider>,
      )
    })

    it('should have New Imaging Request as the title', () => {
      expect(titleSpy).toHaveBeenCalledWith('imagings.requests.new')
    })
  })

  describe('form layout', () => {
    let wrapper: ReactWrapper
    const history = createMemoryHistory()

    beforeEach(() => {
      const store = mockStore({ title: '', imaging: { status: 'loading', error: {} } } as any)
      history.push('/imagings/new')

      wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <NewImagingRequest />
          </Router>
        </Provider>,
      )
    })

    it('should render a patient typeahead', () => {
      const typeaheadDiv = wrapper.find('.patient-typeahead')

      expect(typeaheadDiv).toBeDefined()

      const label = typeaheadDiv.find(Label)
      const typeahead = typeaheadDiv.find(Typeahead)

      expect(label).toBeDefined()
      expect(label.prop('text')).toEqual('imagings.imaging.patient')
      expect(typeahead).toBeDefined()
      expect(typeahead.prop('placeholder')).toEqual('imagings.imaging.patient')
      expect(typeahead.prop('searchAccessor')).toEqual('fullName')
    })

    it('should render a type input box', () => {
      const typeInputBox = wrapper.find(TextInputWithLabelFormGroup)

      expect(typeInputBox).toBeDefined()
      expect(typeInputBox.prop('label')).toEqual('imagings.imaging.type')
      expect(typeInputBox.prop('isRequired')).toBeTruthy()
      expect(typeInputBox.prop('isEditable')).toBeTruthy()
    })

    it('should render a status types select', () => {
      const statusTypesSelect = wrapper.find(SelectWithLabelFormGroup)

      expect(statusTypesSelect).toBeDefined()
      expect(statusTypesSelect.prop('label')).toEqual('imagings.imaging.status')
      expect(statusTypesSelect.prop('isRequired')).toBeTruthy()
      expect(statusTypesSelect.prop('isEditable')).toBeTruthy()
      expect(statusTypesSelect.prop('options')).toHaveLength(3)
      expect(statusTypesSelect.prop('options')[0].label).toEqual('imagings.status.requested')
      expect(statusTypesSelect.prop('options')[0].value).toEqual('requested')
      expect(statusTypesSelect.prop('options')[1].label).toEqual('imagings.status.completed')
      expect(statusTypesSelect.prop('options')[1].value).toEqual('completed')
      expect(statusTypesSelect.prop('options')[2].label).toEqual('imagings.status.canceled')
      expect(statusTypesSelect.prop('options')[2].value).toEqual('canceled')
    })

    it('should render a notes text field', () => {
      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('imagings.imaging.notes')
      expect(notesTextField.prop('isRequired')).toBeFalsy()
      expect(notesTextField.prop('isEditable')).toBeTruthy()
    })

    it('should render a save button', () => {
      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton).toBeDefined()
      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', () => {
      const cancelButton = wrapper.find(Button).at(1)
      expect(cancelButton).toBeDefined()
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('errors', () => {
    let wrapper: ReactWrapper
    const history = createMemoryHistory()
    const error = {
      message: 'some message',
      patient: 'some patient message',
      type: 'some type error',
      status: 'status type error',
    }

    beforeEach(() => {
      history.push('/imagings/new')
      const store = mockStore({ title: '', imaging: { status: 'error', error } } as any)
      wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <NewImagingRequest />
          </Router>
        </Provider>,
      )
    })

    it('should display errors', () => {
      const alert = wrapper.find(Alert)
      const typeInput = wrapper.find(TextInputWithLabelFormGroup)
      const patientTypeahead = wrapper.find(Typeahead)

      expect(alert.prop('message')).toEqual(error.message)
      expect(alert.prop('title')).toEqual('states.error')
      expect(alert.prop('color')).toEqual('danger')

      expect(patientTypeahead.prop('isInvalid')).toBeTruthy()

      expect(typeInput.prop('feedback')).toEqual(error.type)
      expect(typeInput.prop('isInvalid')).toBeTruthy()
    })
  })

  describe('on cancel', () => {
    let wrapper: ReactWrapper
    const history = createMemoryHistory()

    beforeEach(() => {
      history.push('/imagings/new')
      const store = mockStore({ title: '', imaging: { status: 'loading', error: {} } } as any)
      wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <NewImagingRequest />
          </Router>
        </Provider>,
      )
    })

    it('should navigate back to /imagings', () => {
      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(history.location.pathname).toEqual('/imagings')
    })
  })

  describe('on save', () => {
    let wrapper: ReactWrapper
    const history = createMemoryHistory()
    const expectedDate = new Date()
    const expectedImaging = {
      patient: 'patient',
      type: 'expected type',
      status: 'requested',
      notes: 'expected notes',
      id: '1234',
      requestedOn: expectedDate.toISOString(),
    } as Imaging

    beforeEach(() => {
      jest.resetAllMocks()
      Date.now = jest.fn(() => expectedDate.valueOf())

      history.push('/imagings')
      const store = mockStore({
        title: '',
        imaging: { status: 'loading', error: {} },
        user: { user: { id: '1234' } },
      } as any)
      wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <NewImagingRequest />
          </Router>
        </Provider>,
      )
    })

    it('should save the imaging request and navigate to "/imagings"', async () => {
      const patientTypeahead = wrapper.find(Typeahead)
      await act(async () => {
        const onChange = patientTypeahead.prop('onChange')
        await onChange([{ fullName: expectedImaging.patient }] as Patient[])
      })

      const typeInput = wrapper.find(TextInputWithLabelFormGroup)
      act(() => {
        const onChange = typeInput.prop('onChange') as any
        onChange({ currentTarget: { value: expectedImaging.type } })
      })

      const statusSelect = wrapper.find(SelectWithLabelFormGroup)
      act(() => {
        const onChange = statusSelect.prop('onChange') as any
        onChange({ currentTarget: { value: expectedImaging.status } })
      })

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)
      act(() => {
        const onChange = notesTextField.prop('onChange') as any
        onChange({ currentTarget: { value: expectedImaging.notes } })
      })
      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      const onClick = saveButton.prop('onClick') as any
      expect(saveButton.text().trim()).toEqual('actions.save')
      await act(async () => {
        await onClick()
      })

      expect(history.location.pathname).toEqual(`/imagings`)
    })
  })
})
