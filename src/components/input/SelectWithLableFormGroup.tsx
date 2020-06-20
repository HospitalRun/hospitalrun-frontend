import { Label, Select } from '@hospitalrun/components'
import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  value: string
  label?: string
  name: string
  isRequired?: boolean
  isEditable?: boolean
  options: Option[]
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  feedback?: string
  isInvalid?: boolean
}

const SelectWithLabelFormGroup = (props: Props) => {
  const {
    value,
    label,
    name,
    isEditable,
    options,
    onChange,
    isRequired,
    feedback,
    isInvalid,
  } = props
  const id = `${name}Select`
  return (
    <div className="form-group">
      {label && <Label text={label} htmlFor={id} isRequired={isRequired} />}
      <Select
        disabled={!isEditable}
        onChange={onChange}
        value={value}
        feedback={feedback}
        isInvalid={isInvalid}
      >
        <option disabled value="">
          -- Choose --
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

SelectWithLabelFormGroup.defaultProps = {
  value: '',
}

export default SelectWithLabelFormGroup
