import React, { useState } from 'react'
import { Modal, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import RelatedPerson from 'model/RelatedPerson'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  onSave: (relatedPerson: RelatedPerson) => void
}

const NewRelatedPersonModal = (props: Props) => {
  const { show, toggle, onCloseButtonClick, onSave } = props
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState('')
  const [relatedPerson, setRelatedPerson] = useState({
    prefix: '',
    givenName: '',
    familyName: '',
    suffix: '',
    type: '',
    phoneNumber: '',
    email: '',
    address: '',
  })

  const onFieldChange = (key: string, value: string) => {
    setRelatedPerson({
      ...relatedPerson,
      [key]: value,
    })
  }

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    onFieldChange(fieldName, event.target.value)
  }

  const body = (
    <form>
      {errorMessage && <Alert color="danger" title={t('states.error')} message={errorMessage} />}
      <div className="row">
        <div className="col-md-2">
          <TextInputWithLabelFormGroup
            label={t('patient.prefix')}
            name="prefix"
            value={relatedPerson.prefix}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'prefix')
            }}
          />
        </div>
        <div className="col-md-4">
          <TextInputWithLabelFormGroup
            label={t('patient.givenName')}
            name="givenName"
            value={relatedPerson.givenName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'givenName')
            }}
          />
        </div>
        <div className="col-md-4">
          <TextInputWithLabelFormGroup
            label={t('patient.familyName')}
            name="familyName"
            value={relatedPerson.familyName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'familyName')
            }}
          />
        </div>
        <div className="col-md-2">
          <TextInputWithLabelFormGroup
            label={t('patient.suffix')}
            name="suffix"
            value={relatedPerson.suffix}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'suffix')
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <TextInputWithLabelFormGroup
            name="type"
            label={t('patient.relatedPersons.relationshipType')}
            value={relatedPerson.type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'type')
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TextInputWithLabelFormGroup
            label={t('patient.phoneNumber')}
            name="phoneNumber"
            value={relatedPerson.phoneNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'phoneNumber')
            }}
          />
        </div>
        <div className="col">
          <TextInputWithLabelFormGroup
            label={t('patient.email')}
            placeholder="email@email.com"
            name="email"
            value={relatedPerson.email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'email')
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TextFieldWithLabelFormGroup
            label={t('patient.address')}
            name="address"
            isEditable
            value={relatedPerson.address}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              onFieldChange('address', event.currentTarget.value)
            }}
          />
        </div>
      </div>
    </form>
  )

  return (
    <Modal
      show={show}
      toggle={toggle}
      title={t('patient.relatedPersons.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('patient.relatedPersons.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: () => {
          let newErrorMessage = ''
          if (!relatedPerson.givenName) {
            newErrorMessage += `${t('patient.relatedPersons.error.givenNameRequired')} `
          }

          if (!relatedPerson.type) {
            newErrorMessage += `${t('patient.relatedPersons.error.relationshipTypeRequired')}`
          }

          if (!newErrorMessage) {
            onSave(relatedPerson as RelatedPerson)
          } else {
            setErrorMessage(newErrorMessage.trim())
          }
        },
      }}
    />
  )
}

export default NewRelatedPersonModal
