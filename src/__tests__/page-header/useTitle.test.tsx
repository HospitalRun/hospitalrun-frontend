import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import useTitle from '../../page-header/useTitle'
import * as titleSlice from '../../page-header/title-slice'

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
