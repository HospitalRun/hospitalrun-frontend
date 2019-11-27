import React from 'react'
import useTitle from 'util/useTitle'
import { useTranslation } from 'react-i18next'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  return <h3>This is where the content would go.</h3>
}

export default Dashboard
