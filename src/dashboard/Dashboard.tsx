import React from 'react'
import { useTranslation } from 'react-i18next'
import useTitle from '../page-header/useTitle'
import useButton from 'page-header/useButton'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  useButton(t(''), '', false, 'add')
  return <h3>Example</h3>
}

export default Dashboard
