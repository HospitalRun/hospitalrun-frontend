import React, { useState } from 'react'

import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import useTitle from '../page-header/useTitle'

const Settings = () => {
  useTitle('Settings') // todo: get from translation

  // todo: pull from real file
  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Italian', value: 'it' },
  ]

  const [language, setLanguage] = useState(languageOptions[0].value)

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value)
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
          value={language}
          label="Language"
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
