import { Column, Icon, Row } from '@hospitalrun/components'
import { isEmpty } from 'lodash'
import React, { ReactElement, useEffect, useState } from 'react'
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
const initialContacts = { id: uuid(), type: '', value: '' }

const ContactInfo = (props: Props): ReactElement => {
  const { component, data, errors, label, name, isEditable, onChange } = props
  const [contacts, setContacts] = useState<ContactInfoPiece[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    if (data.length === 0) {
      setContacts([initialContacts])
    } else {
      setContacts([...data])
    }
  }, [setContacts, data])

  const typeOptions = Object.values(ContactInfoTypes).map((value) => ({
    label: t(`patient.contactInfoType.options.${value}`),
    value: `${value}`,
  }))

  const componentList = {
    TextInputWithLabelFormGroup,
    TextFieldWithLabelFormGroup,
  }
  const Component = componentList[component]

  const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    if (onChange) {
      const newType = event.currentTarget.value
      const currentContact = { ...contacts[index], type: newType }
      const newContacts = [...contacts]
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
      const currentContact = { ...contacts[index], value: newValue }
      const newContacts = [...contacts]
      newContacts.splice(index, 1, currentContact)
      onChange(newContacts)
    }
  }

  const entries = contacts.map((entry, i) => {
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
    if (onChange && !contacts.some((c) => isEmpty(c.value.trim()))) {
      onChange([...contacts, { id: uuid(), type: '', value: '' }])
    }
  }

  return (
    <div>
      <Row className="header mb-2">
        <Column xs={12} sm={4}>
          <span className="">{t('patient.contactInfoType.label')}</span>
          <span className="d-sm-none"> &amp; {t(label)}</span>
        </Column>
        <Column className="d-none d-sm-block" sm={8}>
          {t(label)}
        </Column>
      </Row>
      {entries}
      {isEditable && (
        <div className="text-right">
          <button type="button" className="btn btn-link" onClick={onAddClick}>
            <Icon icon="add" /> {t('actions.add')}
          </button>
        </div>
      )}
    </div>
  )
}

ContactInfo.defaultProps = {
  data: [],
}

export default ContactInfo
