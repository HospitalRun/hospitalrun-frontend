import React from 'react'

import useTitle from '../page-header/title/useTitle'
import useTranslator from '../shared/hooks/useTranslator'

const Dashboard: React.FC = () => {
  const { t } = useTranslator()
  useTitle(t('dashboard.label'))
  return <h3>Example</h3>
}

export default Dashboard
