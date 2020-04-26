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
import ViewIncidents from '../../../incidents/list/ViewIncidents'

const mockStore = createMockStore([thunk])

describe('View Incidents', () => {
  let history: any

  let setButtonToolBarSpy: any
  const setup = async (permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/incidents`)
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
              <Route path="/incidents">
                <ViewIncidents />
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
    await setup([Permissions.ViewIncidents])

    expect(titleUtil.default).toHaveBeenCalledWith('incidents.reports.label')
  })
})
