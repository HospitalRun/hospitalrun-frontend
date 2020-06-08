import { renderHook } from '@testing-library/react-hooks'

import useUpdateEffect from '../../hooks/useUpdateEffect'

describe('useUpdateEffect', () => {
  it('should call the function after udpate', () => {
    const mockFn = jest.fn()
    let someVal = 'someVal'
    const { rerender } = renderHook(() => useUpdateEffect(mockFn, [someVal]))
    expect(mockFn).not.toHaveBeenCalled()
    someVal = 'newVal'
    rerender()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
