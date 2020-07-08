import { renderHook } from '@testing-library/react-hooks'

import { useTranslation } from '../../../__mocks__/react-i18next'
import useTranslator from '../../../shared/hooks/useTranslator'

describe('useTranslator', () => {
  it('should return undefined if input value for translation is undefined', () => {
    const { result } = renderHook(() => useTranslator())

    expect(result.current.t(undefined)).toBe(undefined)
  })

  it('should return useTranslation hook result if input value is NOT undefined', () => {
    const { result: useTranslatorResult } = renderHook(() => useTranslator())
    const { result: useTranslationResult } = renderHook(() => useTranslation())

    const result = useTranslatorResult.current.t('patient.firstName')
    const expected = useTranslationResult.current.t('patient.firstName')

    expect(result).toBe(expected)
  })
})
