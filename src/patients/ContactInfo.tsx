import { Spinner, Row, Column, Icon } from '@hospitalrun/components'
import React, { useEffect, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import { ContactInfoPiece } from '../model/ContactInformation'
import { uuid } from '../util/uuid'
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

const ContactInfo = (props: Props): ReactElement => {
  const { component, data, errors, label, name, isEditable, onChange } = props

  const { t } = useTranslation()

  useEffect(() => {
    if (onChange && data.length === 0) {
      onChange([...data, { id: uuid(), value: '' }])
    }
  }, [data, onChange])

  const typeOptions = Object.values(ContactInfoTypes).map((value) => ({
    label: t(`patient.contactInfoType.options.${value}`),
    value: `${value}`,
  }))

  const header = (
    <Row className="header mb-2">
      <Column xs={12} sm={4}>
        <span className="">{t('patient.contactInfoType.label')}</span>
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

  const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    if (onChange) {
      const newType = event.currentTarget.value
      const currentContact = { ...data[index], type: newType }
      const newContacts = [...data]
      newContacts.splice(index, 1, currentContact)
      onChange(newContacts)
    }
  }

  const onValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    if (onChange) {
      const newValue = event.currentTarget.value
      const currentContact = { ...data[index], value: newValue }
      const newContacts = [...data]
      newContacts.splice(index, 1, currentContact)
      onChange(newContacts)
    }
  }

  const entries = data.map((entry, i) => {
    const error = errors ? errors[i] : undefined
    return (
      <Row key={entry.id}>
        <Column sm={4}>
          <SelectWithLabelFormGroup
            name={`${name}Type${i}`}
            value={entry.type}
            isEditable={isEditable}
            options={typeOptions}
            onChange={(event) => onTypeChange(event, i)}
          />
        </Column>
        <Column sm={8}>
          <Component
            name={`${name}${i}`}
            value={entry.value}
            isEditable={isEditable}
            onChange={(event: any) => onValueChange(event, i)}
            feedback={error && t(error)}
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
    newData.push({ id: uuid(), value: '' })

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
