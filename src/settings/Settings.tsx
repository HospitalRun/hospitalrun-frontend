import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import i18n, { resources } from '../i18n'
import useTitle from '../page-header/useTitle'

const Settings = () => {
  const { t } = useTranslation()
  useTitle(t('settings.label'))

  // Language section
  const languageOptions = Object.keys(resources)
    .map((abbr) => ({
      label: resources[abbr].name,
      value: abbr,
    }))
    .sort((a, b) => (a.label > b.label ? 1 : -1))

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value
    i18n.changeLanguage(selected)
  }

  // Temp
  const tempOptions = [
    { label: 'Option A', value: 'option-a' },
    { label: 'Option B', value: 'option-b' },
  ]

  const [temp, setTemp] = useState(tempOptions[0].value)

  const onTempChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTemp(event.target.value)
  }

  return (
    <>
      {/* language selection */}
      <div className="w-75" style={{ minWidth: '350px', maxWidth: '500px' }}>
        <SelectWithLabelFormGroup
          name="language"
          value={i18n.language}
          label={t('settings.language.label')}
          isEditable
          options={languageOptions}
          onChange={onLanguageChange}
        />
      </div>

      {/* temp: another setting */}
      <div className="w-75" style={{ minWidth: '350px', maxWidth: '500px' }}>
        <SelectWithLabelFormGroup
          name="temp"
          value={temp}
          label="Temp setting"
          isEditable
          options={tempOptions}
          onChange={onTempChange}
        />
      </div>
    </>
  )
}

export default Settings
