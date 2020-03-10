import React from 'react'
import { Label, Select } from '@hospitalrun/components'

interface Option {
  label: string
  value: string
}

interface Props {
  value: string
  label: string
  name: string
  isEditable?: boolean
  options: Option[]
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectWithLabelFormGroup = (props: Props) => {
  const { value, label, name, isEditable, options, onChange } = props
  const id = `${name}Select`
  return (
    <div className="form-group">
      <Label text={label} htmlFor={id} />
      <Select disabled={!isEditable} onChange={onChange} value={value}>
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
