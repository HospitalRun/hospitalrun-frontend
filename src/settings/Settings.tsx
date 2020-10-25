import { Row, Column } from '@hospitalrun/components'
import React, { useEffect } from 'react'

import { useUpdateTitle } from '../page-header/title/TitleContext'
import LanguageSelector from '../shared/components/input/LanguageSelector'
import useTranslator from '../shared/hooks/useTranslator'

const Settings = () => {
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('settings.label'))
  })
  return (
    <>
      <Row>
        <Column xs={12} sm={9}>
          <LanguageSelector />
        </Column>
        <Column xs={0} sm={3} />
      </Row>
    </>
  )
}

export default Settings
