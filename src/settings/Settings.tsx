import { Row, Column } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

import useTitle from '../page-header/title/useTitle'
import LanguageSelector from '../shared/components/input/LanguageSelector'

const Settings = () => {
  const { t } = useTranslation()
  useTitle(t('settings.label'))

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
