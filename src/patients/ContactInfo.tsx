import { Select, Label, Spinner, Row, Column, Icon } from '@hospitalrun/components'
import React, { useEffect, ReactElement } from 'react'

import { SelectOption } from '../shared/components/input/SelectOption'
import TextFieldWithLabelFormGroup from '../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../shared/hooks/useTranslator'
import { ContactInfoPiece } from '../shared/model/ContactInformation'
import { uuid } from '../shared/util/uuid'
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

  const { t } = useTranslator()

  useEffect(() => {
    if (onChange && data.length === 0) {
      onChange([...data, { id: uuid(), value: '' }])
    }
  }, [data, onChange])

  const typeOptions: SelectOption[] = Object.values(ContactInfoTypes).map((value) => ({
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

  const onTypeChange = (newType: string, index: number) => {
    if (onChange) {
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
          <div className="form-group" data-testid={`${name}Type${i}Select`}>
            <Label text={`${name}Type${i}`} />
            <Select
              id={`${name}Type${i}Select`}
              options={typeOptions}
              defaultSelected={typeOptions.filter(({ value }) => value === entry.type)}
              onChange={(values) => onTypeChange(values[0], i)}
              disabled={!isEditable}
            />
          </div>
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
    return (
      <Spinner
        aria-hidden="false"
        aria-label="Loading"
        color="blue"
        loading
        size={20}
        type="SyncLoader"
      />
    )
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
