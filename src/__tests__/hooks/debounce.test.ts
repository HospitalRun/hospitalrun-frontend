import { renderHook, act } from '@testing-library/react-hooks'
import useDebounce from 'hooks/debounce'

describe('useDebounce', () => {
  beforeAll(() => jest.useFakeTimers())

  afterAll(() => jest.useRealTimers())

  it('should set the next value after the input value has not changed for the specified amount of time', () => {
    const initialValue = 'initialValue'
    const expectedValue = 'someValue'
    const debounceDelay = 500

    let currentValue = initialValue

    const { rerender, result } = renderHook(() => useDebounce(currentValue, debounceDelay))

    currentValue = expectedValue

    act(() => {
      rerender()
      jest.advanceTimersByTime(debounceDelay)
    })

    expect(result.current).toBe(expectedValue)
  })

  it('should not set a new value before the specified delay has elapsed', () => {
    const initialValue = 'initialValue'
    const nextValue = 'someValue'
    const debounceDelay = 500

    let currentValue = initialValue

    const { rerender, result } = renderHook(() => useDebounce(currentValue, debounceDelay))

    currentValue = nextValue

    act(() => {
      rerender()
      jest.advanceTimersByTime(debounceDelay - 1)
    })

    expect(result.current).toBe(initialValue)
  })
})
