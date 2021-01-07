import { Button, Typeahead, Label } from '@hospitalrun/components'
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
import * as titleUtil from '../../../page-header/title/TitleContext'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLabelFormGroup'
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

  const setup = async () => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/imaging/new`)
    const store = mockStore({} as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
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
    })
    wrapper.find(NewImagingRequest).props().updateTitle = jest.fn()
    wrapper.update()
    return wrapper as ReactWrapper
  }

  describe('title and breadcrumbs', () => {
    it('should have called the useUpdateTitle hook', async () => {
      await setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })
  })

  describe('form layout', () => {
    it('should render a patient typeahead', async () => {
      const wrapper = await setup()
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
      const wrapper = await setup()
      const visitsTypeSelect = wrapper.find('.visits').find(SelectWithLabelFormGroup)
      expect(visitsTypeSelect).toBeDefined()
      expect(visitsTypeSelect.prop('label')).toEqual('patient.visits.label')
      expect(visitsTypeSelect.prop('isRequired')).toBeTruthy()
    })

    it('should render a type input box', async () => {
      const wrapper = await setup()
      const typeInputBox = wrapper.find(TextInputWithLabelFormGroup)

      expect(typeInputBox).toBeDefined()
      expect(typeInputBox.prop('label')).toEqual('imagings.imaging.type')
      expect(typeInputBox.prop('isRequired')).toBeTruthy()
      expect(typeInputBox.prop('isEditable')).toBeTruthy()
    })

    it('should render a status types select', async () => {
      const wrapper = await setup()
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
      const wrapper = await setup()
      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('imagings.imaging.notes')
      expect(notesTextField.prop('isRequired')).toBeFalsy()
      expect(notesTextField.prop('isEditable')).toBeTruthy()
    })

    it('should render a save button', async () => {
      const wrapper = await setup()
      const saveButton = wrapper.find(Button).at(0)
      expect(saveButton).toBeDefined()
      expect(saveButton.text().trim()).toEqual('imagings.requests.create')
    })

    it('should render a cancel button', async () => {
      const wrapper = await setup()
      const cancelButton = wrapper.find(Button).at(1)
      expect(cancelButton).toBeDefined()
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('on cancel', () => {
    it('should navigate back to /imaging', async () => {
      const wrapper = await setup()
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

      const wrapper = await setup()
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
      expect(saveButton.text().trim()).toEqual('imagings.requests.create')
      await act(async () => {
        await onClick()
      })

      expect(history.location.pathname).toEqual(`/imaging/new`)
    })
  })
})
