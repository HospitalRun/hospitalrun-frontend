import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function useTranslator() {
  const { t } = useTranslation()

  const translate = useCallback((key: any): any => (key !== undefined ? t(key) : undefined), [t])

  return {
    t: translate,
  }
}
