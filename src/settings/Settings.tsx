import { Row, Column } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

import LanguageSelector from '../components/input/LanguageSelector'
import useTitle from '../page-header/useTitle'

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
