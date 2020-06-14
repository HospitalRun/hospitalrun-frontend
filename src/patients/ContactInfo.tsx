import { Spinner, Row, Column, Icon } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import { ContactInfoPiece } from '../model/ContactInformation'
import ContactInfoTypes from './ContactInfoTypes'

interface Props {
  data: ContactInfoPiece[]
  errors?: string[]
  label: string
  name: string
  isEditable?: boolean
  onChange?: (newData: ContactInfoPiece[]) => void
  type: 'text' | 'email' | 'tel'
  isValid?: (entry: string) => boolean
  errorMessageLabel: string
}

const ContactInfo = (props: Props) => {
  const {
    data,
    errors,
    label,
    name,
    isEditable,
    onChange,
    type,
    isValid,
    errorMessageLabel,
  } = props
  const [tempErrors, setTempErrors] = useState<string[]>()

  const { t } = useTranslation()

  useEffect(() => {
    if (!onChange) {
      return
    }
    if (data.length === 0) {
      onChange([...data, { value: '' }])
    }
  }, [data, onChange])

  const getError = (i: number) => {
    const tempError = tempErrors ? tempErrors[i] : null
    if (tempError) {
      return t(tempError)
    }

    const error = errors ? errors[i] : null
    if (error) {
      return t(error)
    }

    return ''
  }

  const typeLabel = t('patient.contactInfoType.label')
  const typeOptions = Object.values(ContactInfoTypes).map((value) => ({
    label: t(`patient.contactInfoType.options.${value}`),
    value: `${value}`,
  }))

  const addLabel = t('actions.add')

  const onChangeValue = (event: any, prevValue: string) => {
    if (!onChange) {
      return
    }

    // eslint-disable-next-line no-shadow
    const newData = data.map(({ value, type }) =>
      value === prevValue ? { value: event.currentTarget.value, type } : { value, type },
    )
    onChange(newData)
  }

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

  // todo: acts strange when deleting empty rows above non-empty rows.
  // suspect TextInputWithLabelFormGroup missing value
  const entries = data.map((entry, i) => {
    const error = getError(i)
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
                    // eslint-disable-next-line no-shadow
                    const newData = data.map(({ value, type }) =>
                      value === entry.value
                        ? { value, type: event.currentTarget.value }
                        : { value, type },
                    )
                    onChange(newData)
                  }
                : undefined
            }
          />
        </Column>
        <Column sm={8}>
          {['tel', 'email'].indexOf(type) > -1 ? (
            <TextInputWithLabelFormGroup
              name={`${name}${i}`}
              value={entry.value}
              isEditable={isEditable}
              onChange={
                onChange
                  ? (event) => {
                      onChangeValue(event, entry.value)
                    }
                  : undefined
              }
              feedback={error}
              isInvalid={!!error}
              type={type}
            />
          ) : (
            <TextFieldWithLabelFormGroup
              name={`${name}${i}`}
              value={entry.value}
              isEditable={isEditable}
              onChange={
                onChange
                  ? (event) => {
                      onChangeValue(event, entry.value)
                    }
                  : undefined
              }
              feedback={error}
              isInvalid={!!error}
            />
          )}
        </Column>
      </Row>
    )
  })

  const onClickAdd = () => {
    if (!isValid || !onChange) {
      return
    }

    // 1. pick up only non-empty string
    const newData = data.filter(({ value }) => value.trim() !== '')

    // 2. gather errors
    const newTempErrors = newData.map(({ value }) => (isValid(value) ? '' : errorMessageLabel))

    // 3. if no error, add a new entry
    if (newTempErrors.filter((error) => error !== '').length === 0) {
      newData.push({ value: '' })
    }

    // 4. send updates
    onChange(newData)
    setTempErrors(newTempErrors)
  }

  const addButton = (
    <div className="text-right">
      <button
        type="button"
        className="btn btn-link"
        onClick={isValid && onChange ? onClickAdd : undefined}
      >
        <Icon icon="add" /> {addLabel}
      </button>
    </div>
  )

  return isEditable && data.length === 0 ? (
    <Spinner color="blue" loading size={20} type="SyncLoader" />
  ) : (
    <div>
      {data.length > 0 ? header : null}
      {entries}
      {isEditable ? addButton : null}
    </div>
  )
}

ContactInfo.defaultProps = {
  data: [],
  type: 'text',
  errorMessageLabel: 'patient.errors.invalidInputPlaceholder',
}

export default ContactInfo
