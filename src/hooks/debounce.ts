import { useState, useEffect } from 'react'

export default function (value: any, delayInMilliseconds: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debounceHandler = setTimeout(() => setDebouncedValue(value), delayInMilliseconds)

    return () => clearTimeout(debounceHandler)
  }, [value, delayInMilliseconds])

  return debouncedValue
}
