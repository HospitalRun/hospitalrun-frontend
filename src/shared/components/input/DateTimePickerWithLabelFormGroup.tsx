import { Label, DateTimePicker } from '@hospitalrun/components'
import React from 'react'

interface Props {
  name: string
  label: string
  value: Date | undefined
  isEditable?: boolean
  isRequired?: boolean
  onChange?: (date: Date) => void
  feedback?: string
  isInvalid?: boolean
}

const DateTimePickerWithLabelFormGroup = (props: Props) => {
  const { onChange, label, name, isEditable, value, isRequired, feedback, isInvalid } = props
  const id = `${name}DateTimePicker`
  return (
    <div className="form-group" data-testid={id}>
      <Label text={label} isRequired={isRequired} htmlFor={id} />
      <DateTimePicker
        dateFormat="MM/dd/yyyy h:mm aa"
        dateFormatCalendar="LLLL yyyy"
        dropdownMode="scroll"
        disabled={!isEditable}
        selected={value}
        isInvalid={isInvalid}
        feedback={feedback}
        onChange={(inputDate) => {
          if (onChange) {
            onChange(inputDate)
          }
        }}
        showTimeSelect
        timeCaption="time"
        timeFormat="h:mm aa"
        timeIntervals={15}
        withPortal={false}
      />
    </div>
  )
}

export default DateTimePickerWithLabelFormGroup
