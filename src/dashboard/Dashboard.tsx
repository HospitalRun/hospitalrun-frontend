import React from 'react'

import { useUpdateTitle } from '../page-header/title/TitleContext'
import useTranslator from '../shared/hooks/useTranslator'

const Dashboard: React.FC = () => {
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  updateTitle(t('dashboard.label'))
  return <h3>Example</h3>
}

export default Dashboard
