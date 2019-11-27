import React from 'react'
import useTitle from 'util/useTitle'
import { useTranslation } from 'react-i18next'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  return <h3>Example</h3>
}

export default Dashboard
