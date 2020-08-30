import { Button, Typeahead, Label, Alert } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewImagingRequest from '../../../imagings/requests/NewImagingRequest'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/useTitle'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import Imaging from '../../../shared/model/Imaging'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Imaging Request', () => {
  let history: any
  let setButtonToolBarSpy: any

  const setup = async (status: string, error: any = {}) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/imaging/new`)
    const store = mockStore({
      title: '',
      user: { user: { id: '1234' } },
      imaging: {
        status,
        error,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/imaging/new">
                <NewImagingRequest />
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })
    wrapper.update()
    return wrapper as ReactWrapper
  }

  describe('title and breadcrumbs', () => {
    it('should have New Imaging Request as the title', async () => {
      await setup('loading', {})
      expect(titleUtil.default).toHaveBeenCalledWith('imagings.requests.new')
    })
  })

  describe('form layout', () => {
    it('should render a patient typeahead', async () => {
      const wrapper = await setup('loading', {})
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

    it('should render a dropdown list of visits', async () => {
      const wrapper = await setup('loading', {})
      const visitsTypeSelect = wrapper.find('.visits').find(SelectWithLabelFormGroup)
      expect(visitsTypeSelect).toBeDefined()
      expect(visitsTypeSelect.prop('label')).toEqual('patient.visits.label')
      expect(visitsTypeSelect.prop('isRequired')).toBeTruthy()
    })

    it('should render a type input box', async () => {
      const wrapper = await setup('loading', {})
      const typeInputBox = wrapper.find(TextInputWithLabelFormGroup)

      expect(typeInputBox).toBeDefined()
      expect(typeInputBox.prop('label')).toEqual('imagings.imaging.type')
      expect(typeInputBox.prop('isRequired')).toBeTruthy()
      expect(typeInputBox.prop('isEditable')).toBeTruthy()
    })

    it('should render a status types select', async () => {
      const wrapper = await setup('loading', {})
      const statusTypesSelect = wrapper.find('.imaging-status').find(SelectWithLabelFormGroup)

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

    it('should render a notes text field', async () => {
      const wrapper = await setup('loading', {})
      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('imagings.imaging.notes')
      expect(notesTextField.prop('isRequired')).toBeFalsy()
      expect(notesTextField.prop('isEditable')).toBeTruthy()
    })

    it('should render a save button', async () => {
      const wrapper = await setup('loading', {})
      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton).toBeDefined()
      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', async () => {
      const wrapper = await setup('loading', {})
      const cancelButton = wrapper.find(Button).at(1)
      expect(cancelButton).toBeDefined()
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('errors', () => {
    const error = {
      message: 'some message',
      patient: 'some patient message',
      type: 'some type error',
      status: 'status type error',
    }

    it('should display errors', async () => {
      const wrapper = await setup('error', error)
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
    it('should navigate back to /imaging', async () => {
      const wrapper = await setup('loading', {})
      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(history.location.pathname).toEqual('/imaging')
    })
  })

  describe('on save', () => {
    it('should save the imaging request and navigate to "/imaging"', async () => {
      const expectedDate = new Date()
      const expectedImaging = {
        patient: 'patient',
        type: 'expected type',
        status: 'requested',
        visitId: 'expected visitId',
        notes: 'expected notes',
        id: '1234',
        requestedOn: expectedDate.toISOString(),
      } as Imaging

      const wrapper = await setup('loading', {})
      jest.spyOn(ImagingRepository, 'save').mockResolvedValue({ ...expectedImaging })

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

      const statusSelect = wrapper.find('.imaging-status').find(SelectWithLabelFormGroup)
      act(() => {
        const onChange = statusSelect.prop('onChange') as any
        onChange({ currentTarget: { value: expectedImaging.status } })
      })

      const visitsSelect = wrapper.find('.visits').find(SelectWithLabelFormGroup)
      act(() => {
        const onChange = visitsSelect.prop('onChange') as any
        onChange({ currentTarget: { value: expectedImaging.visitId } })
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

      expect(history.location.pathname).toEqual(`/imaging/new`)
    })
  })
})
