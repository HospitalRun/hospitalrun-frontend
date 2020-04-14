import React from 'react'
import { Label, DateTimePicker } from '@hospitalrun/components'

interface Props {
  name: string
  label: string
  value: Date | undefined
  isEditable?: boolean
  onChange?: (date: Date) => void
  isRequired?: boolean
  feedback?: string
  isInvalid?: boolean
  maxDate?: Date
}

const DatePickerWithLabelFormGroup = (props: Props) => {
  const {
    onChange,
    label,
    name,
    isEditable,
    value,
    isRequired,
    feedback,
    isInvalid,
    maxDate,
  } = props
  const id = `${name}DatePicker`
  return (
    <div className="form-group">
      <Label text={label} htmlFor={id} isRequired={isRequired} />
      <DateTimePicker
        dateFormat="MM/dd/yyyy"
        dateFormatCalendar="LLLL yyyy"
        dropdownMode="scroll"
        maxDate={maxDate}
        selected={value}
        timeIntervals={30}
        withPortal={false}
        disabled={!isEditable}
        feedback={feedback}
        isInvalid={isInvalid}
        onChange={(inputDate) => {
          if (onChange) {
            onChange(inputDate)
          }
        }}
      />
    </div>
  )
}

export default DatePickerWithLabelFormGroup
