import React from 'react'
import { TextInput, Label } from '@hospitalrun/components'

interface Props {
  value: string
  label: string
  name: string
  isEditable?: boolean
  type: 'text' | 'email' | 'number' | 'tel'
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInputWithLabelFormGroup = (props: Props) => {
  const { value, label, name, isEditable, onChange, placeholder, type } = props
  const id = `${name}TextInput`
  return (
    <div className="form-group">
      <Label text={label} htmlFor={id} />
      <TextInput
        id={id}
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
