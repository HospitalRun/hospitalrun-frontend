import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as breadcrumbsSlice from '../../../page-header/breadcrumbs/breadcrumbs-slice'
import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'

const mockStore = createMockStore<any, any>([thunk])

describe('useAddBreadcrumbs', () => {
  beforeEach(() => jest.clearAllMocks())

  const setup = () => {
    const breadcrumbs = [
      {
        text: 'Patients',
        location: '/patients',
      },
    ]
    const wrapper: React.FC = ({ children }) => (
      <Provider store={mockStore({})}>{children}</Provider>
    )

    return { breadcrumbs, wrapper }
  }

  it('should call addBreadcrumbs with the correct data', () => {
    jest.spyOn(breadcrumbsSlice, 'addBreadcrumbs')
    const { breadcrumbs, wrapper } = setup()

    renderHook(() => useAddBreadcrumbs(breadcrumbs), { wrapper } as any)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledWith(breadcrumbs)
  })

  it('should call addBreadcrumbs with an additional dashboard breadcrumb', () => {
    jest.spyOn(breadcrumbsSlice, 'addBreadcrumbs')
    const { breadcrumbs, wrapper } = setup()

    renderHook(() => useAddBreadcrumbs(breadcrumbs, true), { wrapper })
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.addBreadcrumbs).toHaveBeenCalledWith([
      ...breadcrumbs,
      { i18nKey: 'dashboard.label', location: '/' },
    ])
  })

  it('should call removeBreadcrumbs with the correct data after unmount', () => {
    jest.spyOn(breadcrumbsSlice, 'removeBreadcrumbs')
    const { breadcrumbs, wrapper } = setup()

    const { unmount } = renderHook(() => useAddBreadcrumbs(breadcrumbs), { wrapper })
    unmount()
    expect(breadcrumbsSlice.removeBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(breadcrumbsSlice.removeBreadcrumbs).toHaveBeenCalledWith(breadcrumbs)
  })
})
