import { Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewImagings from '../../imagings/ViewImagings'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import ImagingRepository from '../../shared/db/ImagingRepository'
import Imaging from '../../shared/model/Imaging'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Imagings', () => {
  describe('title', () => {
    let titleSpy: any
    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewImagings, Permissions.RequestLab] },
        imagings: { imagings: [] },
      } as any)
      titleSpy = jest.spyOn(titleUtil, 'default')
      jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewImagings />
            </Router>
          </Provider>,
        )
      })
    })

    it('should have the title', () => {
      expect(titleSpy).toHaveBeenCalledWith('imagings.label')
    })
  })

  describe('button bar', () => {
    it('should display button to add new imaging request', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewImagings, Permissions.RequestImaging] },
        imagings: { imagings: [] },
      } as any)
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewImagings />
            </Router>
          </Provider>,
        )
      })

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('imagings.requests.new')
    })

    it('should not display button to add new imaging request if the user does not have permissions', async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewImagings] },
        imagings: { imagings: [] },
      } as any)
      const setButtonToolBarSpy = jest.fn()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
      jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
      await act(async () => {
        await mount(
          <Provider store={store}>
            <Router history={createMemoryHistory()}>
              <ViewImagings />
            </Router>
          </Provider>,
        )
      })

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('table', () => {
    let wrapper: ReactWrapper
    let history: any
    const expectedImaging = {
      code: 'I-1234',
      id: '1234',
      type: 'imaging type',
      patient: 'patient',
      status: 'requested',
      requestedOn: '2020-03-30T04:43:20.102Z',
      requestedBy: 'some user',
    } as Imaging

    beforeEach(async () => {
      const store = mockStore({
        title: '',
        user: { permissions: [Permissions.ViewImagings, Permissions.RequestImaging] },
        imagings: { imagings: [expectedImaging] },
      } as any)
      history = createMemoryHistory()

      jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([expectedImaging])
      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <ViewImagings />
            </Router>
          </Provider>,
        )
      })

      wrapper.update()
    })

    it('should render a table with data', () => {
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
        expect.objectContaining({ label: 'imagings.imaging.patient', key: 'patient' }),
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
