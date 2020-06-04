import { Label, Select } from '@hospitalrun/components'
import React from 'react'

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
  onChange?: (value: string) => void
}

const SelectWithLabelFormGroup = (props: Props) => {
  const { value, label, name, isEditable, options, onChange } = props
  const id = `${name}Select`

  const onSelect = (selected: Option[]) => {
    if (onChange) {
      onChange(selected[0].value as string)
    }
  }

  return (
    <div className="form-group">
      <Label text={label} htmlFor={id} />
      <Select
        id={id}
        disabled={!isEditable}
        onChange={onSelect}
        defaultSelected={options.filter((o) => o.value === value)}
        options={[{ label: '-- Choose --', value: '' }, ...options]}
      />
    </div>
  )
}

SelectWithLabelFormGroup.defaultProps = {
  value: '',
}

export default SelectWithLabelFormGroup
