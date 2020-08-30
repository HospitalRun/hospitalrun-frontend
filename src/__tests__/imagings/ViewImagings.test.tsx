import { Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewImagings from '../../imagings/ViewImagings'
import * as breadcrumbUtil from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import ImagingRepository from '../../shared/db/ImagingRepository'
import Imaging from '../../shared/model/Imaging'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Imagings', () => {
  let history: any
  let setButtonToolBarSpy: any
  const expectedDate = new Date(2020, 5, 3, 19, 48)
  const expectedImaging = {
    code: 'I-1234',
    id: '1234',
    type: 'imaging type',
    patient: 'patient',
    fullName: 'full name',
    status: 'requested',
    requestedOn: expectedDate.toISOString(),
    requestedBy: 'some user',
  } as Imaging

  const setup = async (permissions: Permissions[], mockImagings?: any) => {
    jest.resetAllMocks()
    jest.spyOn(breadcrumbUtil, 'default')
    setButtonToolBarSpy = jest.fn()
    jest.spyOn(titleUtil, 'default')
    jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue(mockImagings)
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    history = createMemoryHistory()
    history.push(`/imaging`)

    const store = mockStore({
      title: '',
      user: { permissions },
      imagings: { imagings: mockImagings },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/imaging">
                <ViewImagings />
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })

    wrapper.update()
    return wrapper as ReactWrapper
  }

  describe('title', () => {
    it('should have the title', async () => {
      await setup([Permissions.ViewImagings], [])
      expect(titleUtil.default).toHaveBeenCalledWith('imagings.label')
    })
  })

  describe('button bar', () => {
    it('should display button to add new imaging request', async () => {
      await setup([Permissions.ViewImagings, Permissions.RequestImaging], [])

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('imagings.requests.new')
    })

    it('should not display button to add new imaging request if the user does not have permissions', async () => {
      await setup([Permissions.ViewImagings], [])

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('table', () => {
    it('should render a table with data', async () => {
      const wrapper = await setup(
        [Permissions.ViewIncident, Permissions.RequestImaging],
        [expectedImaging],
      )
      const table = wrapper.find(Table)
      const columns = table.prop('columns')
      expect(columns[0]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.code', key: 'code' }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.type', key: 'type' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.requestedOn', key: 'requestedOn' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.patient', key: 'fullName' }),
      )
      expect(columns[4]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.requestedBy', key: 'requestedBy' }),
      )
      expect(columns[5]).toEqual(
        expect.objectContaining({ label: 'imagings.imaging.status', key: 'status' }),
      )

      expect(table.prop('data')).toEqual([expectedImaging])
    })
  })
})
