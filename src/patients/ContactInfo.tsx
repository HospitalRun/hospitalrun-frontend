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
  errorLabel?: string
}

const ContactInfo = (props: Props) => {
  const { data, errors, label, name, isEditable, onChange, type, isValid, errorLabel } = props
  const [tempErrors, setTempErrors] = useState<string[]>()

  const { t } = useTranslation()

  useEffect(() => {
    if (data.length === 0) {
      if (onChange) {
        onChange([...data, { value: '' }])
      }
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
    if (onChange) {
      // eslint-disable-next-line no-shadow
      const newData = data.map(({ value, type }) =>
        value === prevValue ? { value: event.currentTarget.value, type } : { value, type },
      )
      onChange(newData)
    }
  }

  const header =
    data?.length === 0 ? null : (
      <Row className="mb-2">
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
  const getEntries = () =>
    data.map((entry, i) => {
      const error = getError(i)
      return (
        <Row>
          <Column sm={4}>
            <SelectWithLabelFormGroup
              name={`${name}Type${i}`} // problem
              value={entry.type}
              isEditable={isEditable}
              options={typeOptions}
              onChange={(event) => {
                if (onChange) {
                  // eslint-disable-next-line no-shadow
                  const newData = data.map(({ value, type }) =>
                    value === entry.value
                      ? { value, type: event.currentTarget.value }
                      : { value, type },
                  )
                  onChange(newData)
                }
              }}
            />
          </Column>
          <Column sm={8}>
            {['tel', 'email'].indexOf(type) > -1 ? (
              <TextInputWithLabelFormGroup
                name={name + i} // problem
                value={entry.value}
                isEditable={isEditable}
                onChange={(event) => {
                  onChangeValue(event, entry.value)
                }}
                feedback={error}
                isInvalid={!!error}
                type={type}
              />
            ) : (
              <TextFieldWithLabelFormGroup
                name={name + i} // problem
                value={entry.value}
                isEditable={isEditable}
                onChange={(event) => {
                  onChangeValue(event, entry.value)
                }}
                feedback={error}
                isInvalid={!!error}
              />
            )}
          </Column>
        </Row>
      )
    })

  const onClickAdd = () => {
    const newData: ContactInfoPiece[] = []
    // eslint-disable-next-line no-underscore-dangle
    const _tempErrors: string[] = []
    let hasError = false

    data.forEach((entry) => {
      const value = entry.value.trim()
      if (value !== '') {
        newData.push(entry)
        if (isValid) {
          if (value === '') {
            _tempErrors.push('')
          } else if (!isValid(value)) {
            _tempErrors.push(errorLabel || 'x')
            hasError = true
          } else {
            _tempErrors.push('')
          }
        }
      }
    })

    // update temp errors
    setTempErrors(_tempErrors)

    // add new one if all good
    if (!hasError) {
      if (newData.length !== 0) {
        if (newData[newData.length - 1].value !== '') {
          newData.push({ value: '' })
        }
      }
    }

    // send data upward
    if (onChange) {
      onChange(newData)
    }
  }

  const addButton = (
    <div className="text-right">
      <button type="button" className="btn btn-link" onClick={onClickAdd}>
        <Icon icon="add" /> {addLabel}
      </button>
    </div>
  )

  return !data ? (
    <Spinner color="blue" loading size={20} type="SyncLoader" />
  ) : (
    <div>
      {header}
      {getEntries()}
      {isEditable ? addButton : null}
    </div>
  )
}

ContactInfo.defaultProps = {
  data: [],
}

export default ContactInfo
