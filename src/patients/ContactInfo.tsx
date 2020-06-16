import { Spinner, Row, Column, Icon } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import { ContactInfoPiece } from '../model/ContactInformation'
import ContactInfoTypes from './ContactInfoTypes'

interface Props {
  component: 'TextInputWithLabelFormGroup' | 'TextFieldWithLabelFormGroup'
  data: ContactInfoPiece[]
  errors?: (string | undefined)[]
  label: string
  name: string
  isEditable?: boolean
  onChange?: (newData: ContactInfoPiece[]) => void
}

const ContactInfo = (props: Props) => {
  const { component, data, errors, label, name, isEditable, onChange } = props

  const { t } = useTranslation()

  useEffect(() => {
    if (onChange && data.length === 0) {
      onChange([...data, { value: '' }])
    }
  }, [data, onChange])

  const typeLabel = t('patient.contactInfoType.label')
  const typeOptions = Object.values(ContactInfoTypes).map((value) => ({
    label: t(`patient.contactInfoType.options.${value}`),
    value: `${value}`,
  }))

  const header = (
    <Row className="header mb-2">
      <Column xs={12} sm={4}>
        <span className="">{typeLabel}</span>
        <span className="d-sm-none"> &amp; {t(label)}</span>
      </Column>
      <Column className="d-none d-sm-block" sm={8}>
        {t(label)}
      </Column>
    </Row>
  )

  const componentList = {
    TextInputWithLabelFormGroup,
    TextFieldWithLabelFormGroup,
  }
  const Component = componentList[component]

  // todo: acts strange when deleting empty rows above non-empty rows.
  // suspect TextInputWithLabelFormGroup missing value
  const entries = data.map((entry, i) => {
    const error = errors ? errors[i] : undefined
    return (
      // todo: want a better key, and possibly name
      // eslint-disable-next-line react/no-array-index-key
      <Row key={i}>
        <Column sm={4}>
          <SelectWithLabelFormGroup
            name={`${name}Type${i}`}
            value={entry.type}
            isEditable={isEditable}
            options={typeOptions}
            onChange={
              onChange
                ? (event) => {
                    const newData = data.map((ref) =>
                      ref.value === entry.value
                        ? { value: entry.value, type: event.currentTarget.value }
                        : { value: ref.value, type: ref.type },
                    )
                    onChange(newData)
                  }
                : undefined
            }
          />
        </Column>
        <Column sm={8}>
          <Component
            name={`${name}${i}`}
            value={entry.value}
            isEditable={isEditable}
            onChange={
              onChange
                ? (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    const newData = data.map((ref) =>
                      ref.value === entry.value
                        ? { value: event.currentTarget.value, type: entry.type }
                        : { value: ref.value, type: ref.type },
                    )
                    onChange(newData)
                  }
                : undefined
            }
            feedback={error}
            isInvalid={!!error}
          />
        </Column>
      </Row>
    )
  })

  const onAddClick = () => {
    if (!onChange) {
      return
    }

    // 1. pick up only non-empty string
    const newData = data.filter(({ value }) => value.trim() !== '')

    // 2. add a new entry
    newData.push({ value: '' })

    // 3. send updates
    onChange(newData)
  }

  const addButton = (
    <div className="text-right">
      <button type="button" className="btn btn-link" onClick={onAddClick}>
        <Icon icon="add" /> {t('actions.add')}
      </button>
    </div>
  )

  if (isEditable && data.length === 0) {
    return <Spinner color="blue" loading size={20} type="SyncLoader" />
  }

  return (
    <div>
      {data.length > 0 ? header : null}
      {entries}
      {isEditable ? addButton : null}
    </div>
  )
}

ContactInfo.defaultProps = {
  data: [],
}

export default ContactInfo
