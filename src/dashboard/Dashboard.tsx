import React from 'react'
import { useTranslation } from 'react-i18next'

import useTitle from '../page-header/title/useTitle'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('dashboard.label'))
  return <h3>Example</h3>
}

export default Dashboard
