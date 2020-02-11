import React from 'react'
import { useTranslation } from 'react-i18next'
import useTitle from '../page-header/useTitle'
import useSetBreadcrumbs from '../breadcrumbs/useSetBreadcrumbs'

const breadcrumbs = [{ i18nKey: 'dashboard.label', location: '/' }]

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  useSetBreadcrumbs(breadcrumbs)
  return <h3>Example</h3>
}

export default Dashboard
