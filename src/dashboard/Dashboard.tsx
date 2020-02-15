import React from 'react'
import { useTranslation } from 'react-i18next'
import useTitle from '../page-header/useTitle'
import useAddBreadcrumbs from '../breadcrumbs/useAddBreadcrumbs'

const breadcrumbs = [{ i18nKey: 'dashboard.label', location: '/' }]

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  useAddBreadcrumbs(breadcrumbs)
  return <h3>Example</h3>
}

export default Dashboard
