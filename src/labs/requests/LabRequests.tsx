import React from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'

const LabRequests = () => {
  const { t } = useTranslation()
  useTitle(t('labs.requests.label'))

  return <h1>Lab Requests</h1>
}

export default LabRequests
