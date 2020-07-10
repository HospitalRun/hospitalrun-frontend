import { Button } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/useTitle'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Incident', () => {
  const expectedDate = new Date(2020, 5, 1, 19, 48)
  let history: any
  const expectedIncident = {
    id: '1234',
    code: 'some code',
    department: 'some department',
    description: 'some description',
    category: 'some category',
    categoryItem: 'some category item',
    status: 'reported',
    reportedBy: 'some user id',
    reportedOn: expectedDate.toISOString(),
    date: expectedDate.toISOString(),
  } as Incident

  const setup = async (mockIncident: Incident, permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

    history = createMemoryHistory()
    history.push(`/incidents/1234`)

    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
      incident: {
        incident: mockIncident,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/incidents/:id">
                <ViewIncident />
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })
    wrapper.update()
    return wrapper
  }

  describe('layout', () => {
    it('should set the title', async () => {
      await setup(expectedIncident, [Permissions.ViewIncident])

      expect(titleUtil.default).toHaveBeenCalledWith(expectedIncident.code)
    })

    it('should set the breadcrumbs properly', async () => {
      await setup(expectedIncident, [Permissions.ViewIncident])

      expect(breadcrumbUtil.default).toHaveBeenCalledWith([
        { i18nKey: expectedIncident.code, location: '/incidents/1234' },
      ])
    })

    it('should render the date of incident', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const dateOfIncidentFormGroup = wrapper.find('.incident-date')
      expect(dateOfIncidentFormGroup.find('h4').text()).toEqual('incidents.reports.dateOfIncident')
      expect(dateOfIncidentFormGroup.find('h5').text()).toEqual('2020-06-01 07:48 PM')
    })

    it('should render the status', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const dateOfIncidentFormGroup = wrapper.find('.incident-status')
      expect(dateOfIncidentFormGroup.find('h4').text()).toEqual('incidents.reports.status')
      expect(dateOfIncidentFormGroup.find('h5').text()).toEqual(expectedIncident.status)
    })

    it('should render the reported by', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const dateOfIncidentFormGroup = wrapper.find('.incident-reported-by')
      expect(dateOfIncidentFormGroup.find('h4').text()).toEqual('incidents.reports.reportedBy')
      expect(dateOfIncidentFormGroup.find('h5').text()).toEqual(expectedIncident.reportedBy)
    })

    it('should render the reported on', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const dateOfIncidentFormGroup = wrapper.find('.incident-reported-on')
      expect(dateOfIncidentFormGroup.find('h4').text()).toEqual('incidents.reports.reportedOn')
      expect(dateOfIncidentFormGroup.find('h5').text()).toEqual('2020-06-01 07:48 PM')
    })

    it('should render the completed on if incident status is completed', async () => {
      const mockIncident = {
        ...expectedIncident,
        status: 'completed',
        completedOn: '2020-07-10 06:33 PM',
      } as Incident
      const wrapper = await setup(mockIncident, [Permissions.ViewIncident])

      const dateOfCompletionFormGroup = wrapper.find('.completed-on')
      expect(dateOfCompletionFormGroup.find('h4').text()).toEqual('incidents.reports.completedOn')
      expect(dateOfCompletionFormGroup.find('h5').text()).toEqual('2020-07-10 06:33 PM')
    })

    it('should not render the completed on if incident status is not completed', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const completedOn = wrapper.find('.completed-on')
      expect(completedOn).toHaveLength(0)
    })

    it('should render the department', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const departmentInput = wrapper.findWhere((w: any) => w.prop('name') === 'department')
      expect(departmentInput.prop('label')).toEqual('incidents.reports.department')
      expect(departmentInput.prop('value')).toEqual(expectedIncident.department)
    })

    it('should render the category', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const categoryInput = wrapper.findWhere((w: any) => w.prop('name') === 'category')
      expect(categoryInput.prop('label')).toEqual('incidents.reports.category')
      expect(categoryInput.prop('value')).toEqual(expectedIncident.category)
    })

    it('should render the category item', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const categoryItemInput = wrapper.findWhere((w: any) => w.prop('name') === 'categoryItem')
      expect(categoryItemInput.prop('label')).toEqual('incidents.reports.categoryItem')
      expect(categoryItemInput.prop('value')).toEqual(expectedIncident.categoryItem)
    })

    it('should render the description', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const descriptionTextInput = wrapper.findWhere((w: any) => w.prop('name') === 'description')
      expect(descriptionTextInput.prop('label')).toEqual('incidents.reports.description')
      expect(descriptionTextInput.prop('value')).toEqual(expectedIncident.description)
    })

    it('should display a complete incident button if the incident is in a reported state', async () => {
      const wrapper = await setup(expectedIncident, [
        Permissions.ViewIncident,
        Permissions.CompleteIncident,
      ])

      const buttons = wrapper.find(Button)
      expect(buttons.at(0).text().trim()).toEqual('incidents.reports.complete')
    })

    it('should not display a complete incident button if the user has no access CompleteIncident access', async () => {
      const wrapper = await setup(expectedIncident, [Permissions.ViewIncident])

      const completeButton = wrapper.find(Button)
      expect(completeButton).toHaveLength(0)
    })

    it('should not display a complete incident button if the incident is completed', async () => {
      const mockIncident = { ...expectedIncident, status: 'completed' } as Incident
      const wrapper = await setup(mockIncident, [Permissions.ViewIncident])

      const completeButton = wrapper.find(Button)
      expect(completeButton).toHaveLength(0)
    })
  })
})
