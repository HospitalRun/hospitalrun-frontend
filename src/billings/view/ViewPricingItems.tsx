import React, { useEffect } from 'react'

import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'

const ViewPricingItems = () => {
  const updateTitle = useUpdateTitle()
  const { t } = useTranslator()

  useEffect(() => {
    updateTitle(t('billing.label'))
  })

  return <p>A</p>
}

export default ViewPricingItems
