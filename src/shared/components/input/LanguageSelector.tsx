import { Select, Label } from '@hospitalrun/components'
import sortBy from 'lodash/sortBy'
import React, { useState } from 'react'

import i18n, { resources } from '../../config/i18n'
import useTranslator from '../../hooks/useTranslator'
import { SelectOption } from './SelectOption'

const LanguageSelector = () => {
  const { t } = useTranslator()
  const [selected, setSelected] = useState(i18n.language)

  let languageOptions: SelectOption[] = Object.keys(resources).map((abbr) => ({
    label: resources[abbr].name,
    value: abbr,
  }))
  languageOptions = sortBy(languageOptions, (o) => o.label)

  const onChange = (value: string) => {
    i18n.changeLanguage(value)
    setSelected(value)
  }

  return (
    <>
      <Label text={t('settings.language.label')} title="language" />
      <Select
        id="language"
        options={languageOptions}
        defaultSelected={languageOptions.filter(({ value }) => value === selected)}
        onChange={(values) => onChange(values[0])}
      />
    </>
  )
}

export default LanguageSelector
