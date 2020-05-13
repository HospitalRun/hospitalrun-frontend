import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleSlice from 'page-header/title-slice'
import useTitle from 'page-header/useTitle'

const store = configureMockStore([thunk])

describe('useTitle', () => {
  it('should call the updateTitle with the correct data', () => {
    const wrapper = ({ children }: any) => <Provider store={store({})}>{children}</Provider>

    jest.spyOn(titleSlice, 'updateTitle')
    const expectedTitle = 'title'

    renderHook(() => useTitle(expectedTitle), { wrapper } as any)
    expect(titleSlice.updateTitle).toHaveBeenCalledTimes(1)
    expect(titleSlice.updateTitle).toHaveBeenCalledWith(expectedTitle)
  })
})
