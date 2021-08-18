import React, { useState } from 'react'
import IntlTelInput, { CountryData } from 'react-intl-tel-input'

import useTranslator from '../../hooks/useTranslator'
import 'react-intl-tel-input/dist/main.css'

interface Props {
  name: string
  label?: string
  value: string | undefined
  isEditable?: boolean
  onChange?: (value: string) => void
  feedback?: string
  isInvalid?: boolean
}

const IntlTelInputWithLabelFormGroup = (props: Props) => {
  const { t } = useTranslator()
  const { onChange, name, isEditable, value: val, feedback, isInvalid } = props
  const id = `${name}IntlTelPicker`

  const [valid, setValid] = useState<boolean>()

  const onPhoneNumberChange = (
    isValid: boolean,
    value: string,
    _selectedCountryData: CountryData,
    fullNumber: string,
    _extension: string,
  ) => {
    setValid(isValid)
    if (onChange) {
      valid ? onChange(fullNumber.replace(/\s/g, '')) : onChange(value)
    }
  }

  const invalidBorderStyle = {
    border: 'solid',
    borderColor: 'red',
    borderRadius: '5px',
    borderWidth: '2px',
  }

  return (
    <div className="form-group">
      <IntlTelInput
        inputClassName={`${isInvalid ? 'is-invalid ' : ''}`}
        onPhoneNumberChange={onPhoneNumberChange}
        disabled={!isEditable}
        value={val}
        formatOnInit={false}
        fieldId={id}
        style={!valid ? invalidBorderStyle : {}}
      />
      {(!valid || isInvalid) && (
        <div className="text-left ml-3 mt-1 text-small text-danger invalid-feedback d-block related-person-feedback is-invalid">
          {feedback || t('patient.errors.invalidPhoneNumber')}
        </div>
      )}
    </div>
  )
}

IntlTelInputWithLabelFormGroup.defaultProps = {
  value: '',
}

export default IntlTelInputWithLabelFormGroup
