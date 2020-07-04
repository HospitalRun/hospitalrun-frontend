import { TextInput, Label } from '@hospitalrun/components'
import React from 'react'

interface Props {
  value: string
  label?: string
  name: string
  isEditable?: boolean
  type: 'text' | 'email' | 'number' | 'tel' | 'password'
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  isRequired?: boolean
  feedback?: string
  isInvalid?: boolean
}

const TextInputWithLabelFormGroup = (props: Props) => {
  const {
    value,
    label,
    name,
    isEditable,
    onChange,
    placeholder,
    type,
    isRequired,
    feedback,
    isInvalid,
  } = props
  const id = `${name}TextInput`
  return (
    <div className="form-group">
      {label && <Label text={label} htmlFor={id} isRequired={isRequired} />}
      <TextInput
        feedback={feedback}
        id={id}
        isInvalid={isInvalid}
        value={value}
        disabled={!isEditable}
        onChange={onChange}
        type={type}
        placeholder={placeholder || label}
      />
    </div>
  )
}

TextInputWithLabelFormGroup.defaultProps = {
  value: '',
  type: 'text',
}

export default TextInputWithLabelFormGroup
