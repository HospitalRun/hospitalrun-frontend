import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import i18n, { resources } from '../../i18n'
import SelectWithLabelFormGroup from './SelectWithLableFormGroup'

const LanguageSelector = () => {
  const { t } = useTranslation()

  let languageOptions = Object.keys(resources).map((abbr) => ({
    label: resources[abbr].name,
    value: abbr,
  }))
  languageOptions = _.sortBy(languageOptions, (o) => o.label)

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value
    i18n.changeLanguage(selected)
  }

  return (
    <SelectWithLabelFormGroup
      name="language"
      value={i18n.language}
      label={t('settings.language.label')}
      isEditable
      options={languageOptions}
      onChange={onLanguageChange}
    />
  )
}

export default LanguageSelector
