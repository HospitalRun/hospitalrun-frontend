import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import * as breadcrumbsSlice from '../../breadcrumbs/breadcrumbs-slice'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'

const store = configureMockStore()

describe('useAddBreadcrumbs', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should call addBreadcrumbs with the correct data', () => {
    const wrapper = ({ children }: any) => <Provider store={store({})}>{children}</Provider>

    jest.spyOn(breadcrumbsSlice, 'addBreadcrumbs')
    const breadcrumbs = [
      {
        text: 'Patients',
        location: '/patients',
      },
    ]

    renderHook(() => useAddBreadcrumbs(breadcrumbs), { wrapper } as any)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledWith(breadcrumbs)
  })

  it('should call addBreadcrumbs with an additional dashboard breadcrumb', () => {
    const wrapper = ({ children }: any) => <Provider store={store({})}>{children}</Provider>

    jest.spyOn(breadcrumbsSlice, 'addBreadcrumbs')
    const breadcrumbs = [
      {
        text: 'Patients',
        location: '/patients',
      },
    ]

    renderHook(() => useAddBreadcrumbs(breadcrumbs, true), { wrapper } as any)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledWith([
      ...breadcrumbs,
      { i18nKey: 'dashboard.label', location: '/' },
    ])
  })

  it('should call removeBreadcrumbs with the correct data after unmount', () => {
    const wrapper = ({ children }: any) => <Provider store={store({})}>{children}</Provider>

    jest.spyOn(breadcrumbsSlice, 'addBreadcrumbs')
    jest.spyOn(breadcrumbsSlice, 'removeBreadcrumbs')
    const breadcrumbs = [
      {
        text: 'Patients',
        location: '/patients',
      },
    ]

    const { unmount } = renderHook(() => useAddBreadcrumbs(breadcrumbs), { wrapper } as any)
    unmount()
    expect(breadcrumbsSlice.removeBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.removeBreadcrumbs).toHaveBeenCalledWith(breadcrumbs)
  })
})
