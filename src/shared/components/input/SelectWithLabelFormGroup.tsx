import { Label, Select } from '@hospitalrun/components'
import React from 'react'

interface Option {
  label: string
  value: string
}

// todo: add feedback in next round
interface Props {
  name: string
  label?: string
  isRequired?: boolean
  options: Option[]
  defaultSelected?: Option[]
  onChange?: (values: string[]) => void
  placeholder: string
  multiple?: boolean
  isEditable?: boolean
  isInvalid?: boolean
}

const SelectWithLabelFormGroup = (props: Props) => {
  const {
    name,
    label,
    isRequired,
    options,
    defaultSelected,
    onChange,
    placeholder,
    multiple,
    isEditable,
    isInvalid,
  } = props
  const id = `${name}Select`
  return (
    <div className="form-group" data-testid={id}>
      {label && <Label text={label} htmlFor={id} isRequired={isRequired} />}
      <Select
        id={id}
        options={options}
        defaultSelected={defaultSelected}
        onChange={onChange}
        placeholder={placeholder}
        multiple={multiple}
        disabled={!isEditable}
        isInvalid={isInvalid}
      />
    </div>
  )
}

SelectWithLabelFormGroup.defaultProps = {
  placeholder: '-- Choose --',
}

export default SelectWithLabelFormGroup
export type { Option }
