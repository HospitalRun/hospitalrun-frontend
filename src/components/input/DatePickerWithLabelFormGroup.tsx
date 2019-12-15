import React from 'react'
import { Label } from '@hospitalrun/components'

interface Props {
  name: string
  label: string
  value: string
  isEditable: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const DatePickerWithLabelFormGroup = (props: Props) => {
  const { onChange, label, name, value, isEditable } = props
  const id = `${name}DatePicker`
  return (
    <div className="form-group">
      <Label text={label} htmlFor={id} />
      <input
        disabled={!isEditable}
        className="form-control"
        type="date"
        value={value}
        id={id}
        onChange={onChange}
      />
    </div>
  )
}

export default DatePickerWithLabelFormGroup
