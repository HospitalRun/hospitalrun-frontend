/* eslint-disable no-console */

import { Button } from '@hospitalrun/components'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
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

    return render(
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

    // wrapper.find(ReportIncident).props().updateTitle = jest.fn()
    // wrapper.update()
  }
  test('type into department field', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const depInput = await screen.findByPlaceholderText(/incidents\.reports\.department/i)
    screen.debug(depInput)
    // expect(depInput).toBeInTheDocument()
  })

  test('type into category field', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const catInput = await screen.findByPlaceholderText(/incidents\.reports\.category\b/i)
    expect(catInput).toBeInTheDocument()
  })

  test('type into category item field', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const catItemInput = await screen.findByPlaceholderText(/incidents\.reports\.categoryitem/i)
    expect(catItemInput).toBeInTheDocument()
  })

  test('type into description field', async () => {
    setup([Permissions.ViewIncident, Permissions.ResolveIncident])
    const descInput = await screen.findByPlaceholderText(/incidents\.reports\.description/i)
    expect(descInput).toBeInTheDocument()
  })

  //     it('should display errors if validation fails', async () => {
  //       const error = {
  //         name: 'incident error',
  //         message: 'something went wrong',
  //         date: 'some date error',
  //         department: 'some department error',
  //         category: 'some category error',
  //         categoryItem: 'some category item error',
  //         description: 'some description error',
  //       }
  //       jest.spyOn(validationUtil, 'default').mockReturnValue(error)

  //       const wrapper = await setup([Permissions.ReportIncident])

  //       const saveButton = wrapper.find(Button).at(0)
  //       await act(async () => {
  //         const onClick = saveButton.prop('onClick') as any
  //         await onClick()
  //       })
  //       wrapper.update()

  //       const dateInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfIncident')
  //       const departmentInput = wrapper.findWhere((w) => w.prop('name') === 'department')
  //       const categoryInput = wrapper.findWhere((w) => w.prop('name') === 'category')
  //       const categoryItemInput = wrapper.findWhere((w) => w.prop('name') === 'categoryItem')
  //       const descriptionInput = wrapper.findWhere((w) => w.prop('name') === 'description')

  //       expect(dateInput.prop('isInvalid')).toBeTruthy()
  //       expect(dateInput.prop('feedback')).toEqual(error.date)

  //       expect(departmentInput.prop('isInvalid')).toBeTruthy()
  //       expect(departmentInput.prop('feedback')).toEqual(error.department)

  //       expect(categoryInput.prop('isInvalid')).toBeTruthy()
  //       expect(categoryInput.prop('feedback')).toEqual(error.category)

  //       expect(categoryItemInput.prop('isInvalid')).toBeTruthy()
  //       expect(categoryItemInput.prop('feedback')).toEqual(error.categoryItem)

  //       expect(descriptionInput.prop('isInvalid')).toBeTruthy()
  //       expect(descriptionInput.prop('feedback')).toEqual(error.description)
  //     })
  //   })

  //   describe('on cancel', () => {
  //     it('should navigate to /incidents', async () => {
  //       const wrapper = await setup([Permissions.ReportIncident])

  //       const cancelButton = wrapper.find(Button).at(1)

  //       act(() => {
  //         const onClick = cancelButton.prop('onClick') as any
  //         onClick()
  //       })

  //       expect(history.location.pathname).toEqual('/incidents')
  //     })
  //   })
})
