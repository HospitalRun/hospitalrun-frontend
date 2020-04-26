import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Permissions from '../../../model/Permissions'
import * as titleUtil from '../../../page-header/useTitle'
import * as ButtonBarProvider from '../../../page-header/ButtonBarProvider'
import * as breadcrumbUtil from '../../../breadcrumbs/useAddBreadcrumbs'
import ViewIncident from '../../../incidents/view/ViewIncident'

const mockStore = createMockStore([thunk])

describe('View Incident', () => {
  let history: any

  const setup = async (permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(titleUtil, 'default')

    history = createMemoryHistory()
    history.push(`/incidents/1234`)
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
    })

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

  it('should set the title', async () => {
    await setup([Permissions.ViewIncident])

    expect(titleUtil.default).toHaveBeenCalledWith('incidents.reports.view')
  })

  it('should set the breadcrumbs properly', async () => {
    await setup([Permissions.ViewIncident])

    expect(breadcrumbUtil.default).toHaveBeenCalledWith([
      { i18nKey: 'incidents.reports.view', location: '/incidents/1234' },
    ])
  })
})
