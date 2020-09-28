/* eslint-disable no-console */

import { Button } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ReportIncident from '../../../incidents/report/ReportIncident'
import * as validationUtil from '../../../incidents/util/validate-incident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Report Incident', () => {
  let history: any

  beforeEach(() => {
    jest.resetAllMocks()
    console.error = jest.fn()
  })

  let setButtonToolBarSpy: any
  const setup = async (permissions: Permissions[]) => {
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
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

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
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
    })
    wrapper.find(ReportIncident).props().updateTitle = jest.fn()
    wrapper.update()
    return wrapper as ReactWrapper
  }

  describe('title', () => {
    it('should have called the useUpdateTitle hook', async () => {
      await setup([Permissions.ReportIncident])
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })
  })

  describe('layout', () => {
    it('should set the breadcrumbs properly', async () => {
      await setup([Permissions.ReportIncident])

      expect(breadcrumbUtil.default).toHaveBeenCalledWith([
        { i18nKey: 'incidents.reports.new', location: '/incidents/new' },
      ])
    })

    it('should have a date input', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const dateInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfIncident')

      expect(dateInput).toHaveLength(1)
      expect(dateInput.prop('label')).toEqual('incidents.reports.dateOfIncident')
      expect(dateInput.prop('isEditable')).toBeTruthy()
      expect(dateInput.prop('isRequired')).toBeTruthy()
    })

    it('should have a department input', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const departmentInput = wrapper.findWhere((w) => w.prop('name') === 'department')

      expect(departmentInput).toHaveLength(1)
      expect(departmentInput.prop('label')).toEqual('incidents.reports.department')
      expect(departmentInput.prop('isEditable')).toBeTruthy()
      expect(departmentInput.prop('isRequired')).toBeTruthy()
    })

    it('should have a category input', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const categoryInput = wrapper.findWhere((w) => w.prop('name') === 'category')

      expect(categoryInput).toHaveLength(1)
      expect(categoryInput.prop('label')).toEqual('incidents.reports.category')
      expect(categoryInput.prop('isEditable')).toBeTruthy()
      expect(categoryInput.prop('isRequired')).toBeTruthy()
    })

    it('should have a category item input', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const categoryInput = wrapper.findWhere((w) => w.prop('name') === 'categoryItem')

      expect(categoryInput).toHaveLength(1)
      expect(categoryInput.prop('label')).toEqual('incidents.reports.categoryItem')
      expect(categoryInput.prop('isEditable')).toBeTruthy()
      expect(categoryInput.prop('isRequired')).toBeTruthy()
    })

    it('should have a description input', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')

      expect(descriptionInput).toHaveLength(1)
      expect(descriptionInput.prop('label')).toEqual('incidents.reports.description')
      expect(descriptionInput.prop('isEditable')).toBeTruthy()
      expect(descriptionInput.prop('isRequired')).toBeTruthy()
    })
  })

  describe('on save', () => {
    it('should report the incident', async () => {
      const wrapper = await setup([Permissions.ReportIncident])
      const expectedIncident = {
        date: new Date().toISOString(),
        department: 'some department',
        category: 'some category',
        categoryItem: 'some category item',
        description: 'some description',
      } as Incident
      jest
        .spyOn(IncidentRepository, 'save')
        .mockResolvedValue({ id: 'someId', ...expectedIncident })

      const dateInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfIncident')
      act(() => {
        const onChange = dateInput.prop('onChange')
        onChange(new Date(expectedIncident.date))
      })

      const departmentInput = wrapper.findWhere((w) => w.prop('name') === 'department')
      act(() => {
        const onChange = departmentInput.prop('onChange')
        onChange({ currentTarget: { value: expectedIncident.department } })
      })

      const categoryInput = wrapper.findWhere((w) => w.prop('name') === 'category')
      act(() => {
        const onChange = categoryInput.prop('onChange')
        onChange({ currentTarget: { value: expectedIncident.category } })
      })

      const categoryItemInput = wrapper.findWhere((w) => w.prop('name') === 'categoryItem')
      act(() => {
        const onChange = categoryItemInput.prop('onChange')
        onChange({ currentTarget: { value: expectedIncident.categoryItem } })
      })

      const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')
      act(() => {
        const onChange = descriptionInput.prop('onChange')
        onChange({ currentTarget: { value: expectedIncident.description } })
      })
      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        onClick()
      })

      expect(IncidentRepository.save).toHaveBeenCalledTimes(1)
      expect(IncidentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(expectedIncident),
      )
      expect(history.location.pathname).toEqual(`/incidents/someId`)
    })

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
      jest.spyOn(validationUtil, 'default').mockReturnValue(error)

      const wrapper = await setup([Permissions.ReportIncident])

      const saveButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick()
      })
      wrapper.update()

      const dateInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfIncident')
      const departmentInput = wrapper.findWhere((w) => w.prop('name') === 'department')
      const categoryInput = wrapper.findWhere((w) => w.prop('name') === 'category')
      const categoryItemInput = wrapper.findWhere((w) => w.prop('name') === 'categoryItem')
      const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')

      expect(dateInput.prop('isInvalid')).toBeTruthy()
      expect(dateInput.prop('feedback')).toEqual(error.date)

      expect(departmentInput.prop('isInvalid')).toBeTruthy()
      expect(departmentInput.prop('feedback')).toEqual(error.department)

      expect(categoryInput.prop('isInvalid')).toBeTruthy()
      expect(categoryInput.prop('feedback')).toEqual(error.category)

      expect(categoryItemInput.prop('isInvalid')).toBeTruthy()
      expect(categoryItemInput.prop('feedback')).toEqual(error.categoryItem)

      expect(descriptionInput.prop('isInvalid')).toBeTruthy()
      expect(descriptionInput.prop('feedback')).toEqual(error.description)
    })
  })

  describe('on cancel', () => {
    it('should navigate to /incidents', async () => {
      const wrapper = await setup([Permissions.ReportIncident])

      const cancelButton = wrapper.find(Button).at(1)

      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/incidents')
    })
  })
})
