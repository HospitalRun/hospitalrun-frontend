import { sortBy } from 'lodash'
import React, { useState } from 'react'

import i18n, { resources } from '../../config/i18n'
import useTranslator from '../../hooks/useTranslator'
import SelectWithLabelFormGroup, { Option } from './SelectWithLableFormGroup'

const LanguageSelector = () => {
  const { t } = useTranslator()
  const [selected, setSelected] = useState(i18n.language)

  let languageOptions: Option[] = Object.keys(resources).map((abbr) => ({
    label: resources[abbr].name,
    value: abbr,
  }))
  languageOptions = sortBy(languageOptions, (o) => o.label)

  const onChange = (value: string) => {
    i18n.changeLanguage(value)
    setSelected(value)
  }

  return (
    <SelectWithLabelFormGroup
      name="language"
      label={t('settings.language.label')}
      options={languageOptions}
      defaultSelected={languageOptions.filter(({ value }) => value === selected)}
      onChange={(values) => onChange(values[0])}
      isEditable
    />
  )
}

export default LanguageSelector
