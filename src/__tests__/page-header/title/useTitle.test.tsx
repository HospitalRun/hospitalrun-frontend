import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TitleProvider } from '../../../page-header/title/TitleContext'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('useTitle', () => {
  const store = mockStore({
    user: { user: { id: '123' }, permissions: [] },
    appointments: { appointments: [] },
    medications: { medications: [] },
    labs: { labs: [] },
    imagings: { imagings: [] },
    breadcrumbs: { breadcrumbs: [] },
    components: { sidebarCollapsed: false },
  } as any)

  it('should call the updateTitle with the correct data.', () => {
    const wrapper = ({ children }: any) => (
      <TitleProvider>
        <Provider store={store}>{children}</Provider>
      </TitleProvider>
    )

    const useTitle = jest.fn()
    const expectedTitle = 'title'

    renderHook(() => useTitle(expectedTitle), { wrapper } as any)

    expect(useTitle).toHaveBeenCalledTimes(1)
    expect(useTitle).toHaveBeenCalledWith(expectedTitle)
  })
})
